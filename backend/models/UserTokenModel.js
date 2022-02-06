module.exports = (sequelize, type) => {
    return sequelize.define('userTokens', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        token: {
            type: type.STRING,
            allowNull: false
        },
        refreshToken: type.STRING
    });
}
