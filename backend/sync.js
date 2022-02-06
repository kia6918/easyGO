const Sequelize = require('sequelize');
const UserModel = require('./models/UserModel');
const UserTokenModel = require('./models/UserTokenModel');
const BusinessModel = require('./models/BusinessModel');
const ReviewModel = require('./models/ReviewModel');
const ReplyModel = require('./models/ReplyModel');
const WishListModel = require('./models/WishListModel');
const CategoryModel = require('./models/CategoryModel');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const config = {
    host: "mysql",
    user: "user",
    password: "supersecretpassword",
    database: "easyGo",
    dialect: "mysql",
    port: "3306",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const db = new Sequelize(config.database, config.user, config.password, {
    host: process.env.DB_HOST,
    dialect: config.dialect,
    pool: config.pool
});

const User = UserModel(db, Sequelize);
const UserToken = UserTokenModel(db, Sequelize);
const Business = BusinessModel(db, Sequelize);
const Review = ReviewModel(db, Sequelize);
const Reply = ReplyModel(db, Sequelize);
const WishList = WishListModel(db, Sequelize);
const Category = CategoryModel(db, Sequelize);

fs.readFile('assets/category.json', (err, data) => {
    if (err) throw err;
    const categories = JSON.parse(data);
    for (const category of categories) {
        Category.findOrCreate({
            where: {
                type: category
            },
            default: {
                type: category
            }
        });
    }
});

db.sync().then(() => {
    console.log('Synced Database successfully!');
});

module.exports = {
    User,
    UserToken,
    Business,
    Review,
    Reply,
    WishList,
    Category
};

