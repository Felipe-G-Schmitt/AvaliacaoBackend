const jwt = require('jsonwebtoken');
const TokenValidate = require('../errors/token-validate');

const JWT_SECRET_KEY = 'fepers';

class authMiddle {
    async ValidarToken(req, res, next) {
        const autenticacao = req.headers.authorization;
        const token = autenticacao && autenticacao.split(' ')[1];

        try {
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            req.user = payload;
            next();
        } catch (error) {
            throw new TokenValidate(`${error.message}`);
        }
    }
}

module.exports = (new authMiddle())