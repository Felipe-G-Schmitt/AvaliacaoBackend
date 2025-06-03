const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = 'fepers';

class loginMiddle {
    async login(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        const senhaValida = await bcrypt.compare(senha, user.password);
        if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    }
}

module.exports = (new loginMiddle())