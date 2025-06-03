const User = require('../models/user')
const bcrypt = require('bcrypt')

const saltRounds = 10;

class UserController {
    async getUser(req, res) {
        const users = await User.findAll();
        return res.json(users);
    }

    async getUserById(req, res) {  
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.json(user);
    }

    async UpdateUser(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const emailExiste = await User.findOne({ where: { email } });
        if (emailExiste && emailExiste.id !== id) {
            return res.status(400).json({ message: "Esse email pertence a outro usuário" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        user.name = nome;
        user.email = email;
        user.senha = senhaCriptografada;

        await user.save();

        res.json(user);
    }

    async DeleteUser(req, res) {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        await user.destroy();

        res.status(204).send({ message: "Usuário deletado" });
    }
}

module.exports = (new UserController())