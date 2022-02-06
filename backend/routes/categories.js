const express = require('express');
const {getBusinessByType} = require("../controllers/businesses");
const {Category} = require("../sync");
const router = express.Router();

router.get('/', async function(req, res, next) {
    Category.findAll().then(categories => {
        res.status(200).json(categories);
    }).catch(error => {
        res.status(400).json({error});
    });
});

router.get('/business', async function(req, res, next) {
    let output = {};
    Category.findAll().then(async categories => {
        for (const category of categories) {
            await getBusinessByType(category.type)
                .then(async businesses => output[category.type] = businesses.length)
        }
        res.status(200).json(output);
    }).catch(error => {
        res.status(400).json({error});
    });
});

module.exports = router;
