const User = require('../models/user')
const bcrypt = require('bcrypt')

const saltRounds = 10;

class registerMiddle {
    async createUser(req, res) {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
        }

        const emailExiste = await User.findOne({ where: { email } });
        if (emailExiste) {
            return res.status(400).json({ message: "Esse email pertence a outro usuário" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const user = await User.create({ name: nome, email, password: senhaCriptografada });

        return res.status(201).json(user)
    }
}

module.exports = (new registerMiddle())