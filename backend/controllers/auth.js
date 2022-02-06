const JWT = require("jsonwebtoken");
const {UserToken} = require("../sync");
const moment = require("moment");

async function tokenResult(token, res, next) {
    try {
        if (token.dataValues) token = token.dataValues.token
        if (!token) return res.status(401).json({error: "Not authorized"});
        else {
            if (decodeJWT(token).exp >= moment().unix()) next();
            else return res.status(401).json({error: "Token expired"});
        }
    } catch (e) {
        return res.status(400).json({error: e.toString()});
    }
}

const decodeJWT = token => {
    return JWT.decode(token, process.env.JWT_SECRET);
}

const checkToken = async (req, res, next) => {
    try {
        const bearerToken = accessToken(req);
        if (bearerToken.error) res.status(401).json(bearerToken)
        else {
            await UserToken.findOne({
                where: {
                    token: bearerToken
                }
            }).then(async token => {
                return await tokenResult(token, res, next);
            })
        }
    } catch (e) {
        return res.status(400).json({error: e.toString()});
    }
}

const accessToken = (req) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        req.header.token = bearer[1];
        if (bearer[0].toLowerCase() === "bearer")
            if (!bearer[1].trim() || bearer[1] === "null") return {error: "Empty Token"};
            else return bearer[1].trim();
        else return {error: "Invalid Auth Type"};
    } else return {error: "Forbidden"};
}

const signToken = (id, time = 30, unit = 'minutes') => {
    return JWT.sign({
        iss: 'EasyGo',
        sub: id,
        iat: moment().unix(),
        exp: moment().add(time, unit).unix()
    }, process.env.JWT_SECRET);
}

module.exports = {
    checkToken,
    signToken,
    decodeJWT,
    tokenResult
}