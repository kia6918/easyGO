const bcrypt = require("bcrypt");
const {Op} = require("sequelize");
const {randomString} = require("../common/utils");
const {signToken, decodeJWT, tokenResult} = require("./auth");
const {User, UserToken, Review, WishList} = require("../sync");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createUser = async (userName, email, rawPassword, isBusiness, avatar = null) => {
    const password = bcrypt.hashSync(rawPassword, 10);
    return await User.create({
        userName,
        email,
        password,
        isBusiness,
        avatar
    });
}

const login = async (email, rawPassword, res) => {
    await findUserByEmail(email).then(async user => {
        if (user) {
            user = user.dataValues;
            if (bcrypt.compareSync(rawPassword, user.password)) {
                return await updateToken(user.id, res);
            } else res.status(401).json({error: "Your password is not correct."});
        } else res.status(404).json({error: "Account does not exist."});
    });
}

const loginWithGoogle = async (token, res) => {
    const decodedJWT = decodeJWT(token);
    const username = decodedJWT.name;
    const avatar = decodedJWT.picture;
    const email = decodedJWT.email;
    await findUserByEmail(email).then(async user => {
        if (user) {
            await tokenResult(token, res, async () => {
                return await updateToken(user.id, res);
            });
        } else {
            await createUser(username, email, randomString(12), false, avatar).then(async user => {
                if (user) await updateToken(user.id, res);
                else return res.status(400).json({error: "Create user from google profile failed."});
            }).catch(e => res.status(400).json({error: e.toString()}));
        }
    });
}

const updateToken = async (id, res) => {
    const token = signToken(id);
    const refreshToken = signToken(id, 1, 'day');
    await findTokenByUserId(id).then(async userToken => {
        if (userToken) await destroyToken(id);
        const loginInfo = await createToken(id, token, refreshToken);
        res.status(201).json(loginInfo);
    });
}

const findTokenByUserId = async (userId) => {
    return UserToken.findOne({
        where: {
            userId
        }
    });
}

const findUserByEmail = async (email) => {
    return User.findOne({
        where: {
            email
        }
    });
}

const findUserByUserId = async (id) => {
    return User.findOne({
        where: {
            id
        }
    });
}

const generateVerificationCode = async (user, res) => {
    const verificationCode = randomString(6);
    const msg = {
        to: user.email,
        from: 'donotreply@easygo.com',
        templateId: "d-d85183e356dd4bc683aa63698359c76c",
        dynamic_template_data: {code: verificationCode}
    };

    await sgMail
        .send(msg)
        .then(async (response) => {
            console.log(response);
            await User.update({
                verificationCode
            }, {
                where: {
                    id: user.id
                }
            }).then(async updated => {
                console.log(updated);
                if (updated) return res.status(201).json({success: true});
                else return res.status(400).json({error: "updated failed"});
            }).catch(e => {
                return res.status(400).json({error: e.toString()});
            })
        })
        .catch((error) => {
            res.status(400).json({error})
        });
}

const findUserByVerificationCode = async (verificationCode) => {
    return User.findOne({
        where: {
            verificationCode
        }
    })
}

const updatePassword = async (id, password) => {
    password = bcrypt.hashSync(password, 10);
    return await User.update({
        password
    }, {
        where: {
            id
        }
    });
}

const updateProfile = async (id, email, body) => {
    return await User.update(body, {
        where: {
            [Op.and]: [
                {
                    id
                },
                {
                    email
                }
            ]
        }
    });
}

const destroyToken = async (userId) => {
    return await UserToken.destroy({
        where: {
            userId
        }
    });
}

const createToken = async (userId, token, refreshToken) => {
    return await UserToken.create({
        userId,
        token,
        refreshToken
    });
}

const refreshToken = async (refreshToken, res) => {
    return UserToken.findOne({
        refreshToken
    }).then(async userToken => {
        await updateToken(userToken.userId, res);
    });
}

const getReviewsByUserId = async (userId) => {
    return Review.findAll({
        where: {
            userId
        }
    });
}

const getWishListByUserId = async (userId) => {
    return WishList.findAll({
        where: {
            userId
        }
    });
}

module.exports = {
    login,
    createUser,
    updateToken,
    destroyToken,
    findUserByUserId,
    findUserByEmail,
    updatePassword,
    updateProfile,
    getReviewsByUserId,
    refreshToken,
    generateVerificationCode,
    findUserByVerificationCode,
    getWishListByUserId,
    loginWithGoogle
}