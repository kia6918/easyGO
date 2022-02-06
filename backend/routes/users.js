const express = require('express');
const {checkToken, decodeJWT} = require("../controllers/auth");
const {User} = require("../sync");
const {
    createUser,
    login,
    updateToken,
    findUserByUserId,
    destroyToken,
    updatePassword,
    findUserByEmail,
    updateProfile,
    refreshToken,
    generateVerificationCode,
    findUserByVerificationCode,
    getReviewsByUserId,
    getWishListByUserId,
    loginWithGoogle
} = require("../controllers/users");
const {createBusiness, getBusiness} = require("../controllers/businesses");
const {isNullOrEmpty, deleteSensitiveInfo, getInsensitiveInfo} = require("../common/utils");
const router = express.Router();

router.get('/', checkToken, function (req, res) {
    try {
        User.findAll().then(async users => {
            res.status(200).send(users);
        });
    } catch (error) {
        res.status(400).json({error});
    }
});

router.post('/', async (req, res) => {
    try {
        const email = req.body.email;
        const rawPassword = req.body.password;
        const userName = req.body.userName;
        const isBusiness = req.body.isBusiness;
        if (isNullOrEmpty(email) || isNullOrEmpty(rawPassword) || isNullOrEmpty(userName))
            throw "Required field cannot be empty.";
        else if (isBusiness && isNullOrEmpty(req.body.name))
            throw "Name is required as a business account.";
        else {
            await createUser(userName.trim(), email.toLowerCase().trim(), rawPassword.trim(), isBusiness).then(async user => {
                if (user) {
                    // business account
                    if (isBusiness) await createBusiness(req.body.name.trim(), user.id);
                    user = deleteSensitiveInfo(user);
                    await generateVerificationCode(user, res);
                } else res.status(400).json({error: "Unknown reason."});
            });
        }
    } catch (error) {
        if (error.errors) res.status(400).json({error: error.errors[0].message});
        else res.status(400).json({error});
    }
});

router.post('/login', async (req, res) => {
    if (isNullOrEmpty(req.body.email) || isNullOrEmpty(req.body.password)) {
        res.status(400).json({error: "Please fill out required fields."});
    } else {
        return await login(req.body.email, req.body.password, res).catch(e => {
            res.status(400).json({error: "Bad Request", reason: e.toString()})
        });
    }
});

router.post('/login2', async (req, res) => {
    if (isNullOrEmpty(req.body.token)) {
        res.status(400).json({error: "Google sign in failed."});
    } else {
        return await loginWithGoogle(req.body.token, res).catch(e => {
            res.status(400).json({error: "Bad Request", reason: e.toString()})
        });
    }
});

router.get('/me', checkToken, async function (req, res) {
    const userId = decodeJWT(req.header.token).sub;
    await findUserByUserId(userId).then(user => {
        user = deleteSensitiveInfo(user);
        if (user.isBusiness) getBusiness(user.id)
            .then(async business => {
                user.dataValues.business = business.dataValues;
                res.status(200).json(user);
            })
            .catch(e => res.status(400).json({error: e.toString()}));
        else {
            res.status(200).json(user);
        }
    }).catch(e => res.status(400).json({error: e.toString()}));
});

router.get('/refresh', function (req, res) {
    try {
        const token = req.query.refreshToken;
        return refreshToken(token, res);
    } catch (e) {
        res.status(400).json({error: e.toString()});
    }

});

router.get('/forgotPassword', async (req, res) => {
    if (!isNullOrEmpty(req.query.email)) {
        await findUserByEmail(req.query.email.toLowerCase()).then(async user => {
            if (user) return await generateVerificationCode(user, res);
            else return res.status(404).json({error: "User not found"});
        });
    } else return res.status(400).json({error: "Email address is not provided."});
});

router.post('/verify', async (req, res) => {
    if (!isNullOrEmpty(req.body.verificationCode)) {
        const verificationCode = req.body.verificationCode;
        await findUserByVerificationCode(verificationCode).then(async user => {
            if (user) {
                await updateProfile(user.id, req.body.email, {
                    verificationCode: null,
                    active: true
                }).then(async () => {
                    await updateToken(user.id, res).catch(e => {
                        return res.status(400).json({error: e.toString()});
                    });
                }).catch(e => {
                    res.status(400).json({error: e.toString()});
                });
            } else {
                res.status(400).json({error: "Invalid verification code."});
            }
        });
    } else {
        res.status(400).json({error: "Verification code is required."});
    }
});

router.put('/resetPassword', checkToken, async (req, res) => {
    const userId = decodeJWT(req.header.token).sub;
    await updatePassword(userId, req.body.password.trim()).then(async () => {
        res.status(200).json({success: true});
    }).catch(e => {
        res.status(400).json({error: "Update failed.", reason: e.toString()})
    });
});

router.put('/profile', checkToken, async (req, res) => {
    const userId = decodeJWT(req.header.token).sub;
    await updateProfile(userId, req.body.email, {
        userName: req.body.userName,
        avatar: req.body.avatar
    }).then(async () => {
        res.status(200).json({success: true});
    }).catch(e => {
        res.status(400).json({error: "Update failed.", reason: e.toString()})
    });
});


router.delete('/logout', checkToken, async (req, res) => {
    const userId = decodeJWT(req.header.token).sub;
    await destroyToken(userId).then(async () => res.status(200).json({success: true}))
        .catch(e => {
            res.status(400).json({error: e})
        });
});

router.get('/:id', async function (req, res) {
    await findUserByUserId(req.params.id).then(async user => {
        if (user) {
            user = getInsensitiveInfo(user);
            if (!user.isBusiness) {
                await getReviewsByUserId(req.params.id).then(async reviews => {
                    user.reviews = reviews;
                });
                await getWishListByUserId(user.id).then(async wishlist => {
                    user.wishlist = wishlist;
                });
            }
            res.status(200).json(user);
        } else {
            res.status(404).json({error: "Not found"});
        }
    }).catch(e => {
        res.status(400).json({error: "Bad Request", reason: e.toString()});
    });
});

module.exports = router;
