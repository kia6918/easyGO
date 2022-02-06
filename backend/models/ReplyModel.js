module.exports = (sequelize, type) => {
    return sequelize.define('replies', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        businessId: {
            type: type.INTEGER,
            references: {
                model: 'businesses',
                key: 'id'
            }
        },
        userId: {
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        reviewId: {
            type: type.INTEGER,
            references: {
                model: 'reviews',
                key: 'id'
            }
        },
        content: {
            type: type.TEXT('LONG'),
            allowNull: false
        }
    });
}
