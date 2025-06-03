const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = 'fepers';

class authMiddle {
    async ValidarToken(req, res, next) {
        const autenticacao = req.headers.authorization;
        const token = autenticacao && autenticacao.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Token inválido" });
        }
    }
}

module.exports = (new authMiddle())