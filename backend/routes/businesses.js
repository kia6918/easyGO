const express = require('express');
const {findUserByUserId} = require("../controllers/users");
const {Op} = require("sequelize");
const {
    updateBusiness,
    getBusiness,
    getBusinessById,
    findReviewsByBusinessId,
    getNewBusinessList,
    getRate,
    findRepliesByReviewId,
    getBusinessByType
} = require("../controllers/businesses");
const {decodeJWT, checkToken} = require("../controllers/auth");
const {isNullOrEmpty} = require("../common/utils");
const {Business, Review, Reply} = require("../sync");
const router = express.Router();

router.get('/', async function (req, res) {
    try {
        await Business.findAll(
            {
                order: [
                    ['clicktrack', 'DESC']
                ]
            }
        ).then(async businesses => {
            return await getNewBusinessList(businesses, res);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/categories/:type', async function (req, res) {
    try {
        await getBusinessByType(req.params.type).then(async businesses => {
            return await getNewBusinessList(businesses, res);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/info', checkToken, async function (req, res) {
    try {
        const getBus = (get, param) => {
            get(param).then(async business => {
                if (business) {
                    await findReviewsByBusinessId(business.id).then(async reviews => {
                        await getRate(reviews).then(async rate => {
                            business.dataValues.rate = rate;
                            let newReviews = [];
                            for (const review of reviews) {
                                await findRepliesByReviewId(review.id)
                                    .then(async reply => {
                                        review.dataValues.reply = reply;
                                    })
                                newReviews.push(review);
                            }
                            business.dataValues.reviews = newReviews;
                        });
                        await findUserByUserId(business.userId).then(async user => {
                            business.dataValues.user = user;
                        });
                        res.status(200).json(business);
                    });
                } else res.status(404).json({error: "Business not found"});
            });
        }
        if (isNullOrEmpty(req.query.id) && isNullOrEmpty(req.query.userId)) {
            const userId = decodeJWT(req.header.token).sub;
            getBus(getBusiness, userId)
        } else if (isNullOrEmpty(req.query.userId) && !isNullOrEmpty(req.query.id)) {
            getBus(getBusinessById, req.query.id)
        } else if (isNullOrEmpty(req.query.id) && !isNullOrEmpty(req.query.userId)) {
            getBus(getBusinessById, req.query.userId)
        } else {
            res.status(400).json({error: "Wrong query params"});
        }
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.put('/info', checkToken, async function (req, res) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        updateBusiness(req.body, userId).then(business => {
            res.status(200).json(business);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/search', async function (req, res) {
    try {
        const keyword = "%" + req.query.keyword + "%";
        await Business.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        address: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        country: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        province: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        city: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        category: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        website: {
                            [Op.like]: keyword
                        }
                    }
                ]
            }
        }).then(async businesses => {
            return await getNewBusinessList(businesses, res);
        })
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.put('/:businessId/click', async function (req, res) {
    try {
        getBusinessById(req.params.businessId).then(async business => {
            if (!business) {
                res.status(404).json({error: "Business not found"});
            } else {
                await updateBusiness(
                    {clicktrack: business.clicktrack + 1},
                    business.userId).then(async updated => {
                    if (updated) res.status(200).json({success: true});
                    else res.status(400).json({error: "Click track not updated"});
                });
            }
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.post('/:businessId/reviews', checkToken, async function (req, res) {
    try {
        if (isNullOrEmpty(req.body.content)) throw "Required field cannot be empty.";
        else {
            const userId = decodeJWT(req.header.token).sub;
            await Review.create({
                userId,
                businessId: req.params.businessId,
                content: req.body.content.trim(),
                rate: req.body.rate
            }).then(async review => {
                if (review) res.status(201).json(review);
                else res.status(400).json({error: "Review not created"});
            });
        }
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.put('/:businessId/reviews/:reviewId', checkToken, async function (req, res) {
    try {
        if (isNullOrEmpty(req.body.content)) throw "Required field cannot be empty.";
        else {
            const userId = decodeJWT(req.header.token).sub;
            await Review.update({
                userId,
                businessId: req.params.businessId,
                content: req.body.content.trim(),
                rate: req.body.rate
            }, {
                where: {
                    id: req.params.reviewId
                }
            }).then(async review => {
                if (review > 0) res.status(201).json({success: true});
                else res.status(400).json({error: "Review not updated"});
            });
        }
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.post('/:businessId/reviews/:reviewId/replies', checkToken, async function (req, res) {
    try {
        if (isNullOrEmpty(req.body.content)) throw "Required field cannot be empty.";
        else {
            const userId = decodeJWT(req.header.token).sub;
            await Reply.create({
                userId,
                businessId: req.params.businessId,
                reviewId: req.params.reviewId,
                content: req.body.content.trim()
            }).then(async reply => {
                if(reply) res.status(201).json(reply);
                else res.status(400).json({error: "Update failed"});
            });
        }
    } catch
        (error) {
        res.status(400).json({error: error.toString()});
    }
});

module.exports = router;
