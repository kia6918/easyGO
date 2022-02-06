module.exports = (sequelize, type) => {
    return sequelize.define('wishlists', {
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
        }
    });
}
