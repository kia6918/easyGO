const isNullOrEmpty = (obj) => {
    return !obj || !obj.trim();
}

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function deleteSensitiveInfo(user) {
    delete user["dataValues"].password;
    delete user["dataValues"].verificationCode;
    return user;
}

function getInsensitiveInfo(user) {
    return {
        id: user.id,
        userName: user.userName,
        avatar: user.avatar,
        isBusiness: user.isBusiness
    }
}

module.exports = {
    isNullOrEmpty,
    randomString,
    deleteSensitiveInfo,
    getInsensitiveInfo
}