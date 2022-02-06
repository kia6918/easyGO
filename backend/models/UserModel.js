module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false
        },
        userName: {
            type: type.STRING,
            allowNull: false
        },
        active: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        // 1 as business, 0 as normal user
        isBusiness: type.BOOLEAN,
        admin: {
            type: type.BOOLEAN,
            defaultValue: 0
        },
        avatar: type.TEXT('LONG'),
        verificationCode: type.STRING,
        password: type.STRING
    });
}
