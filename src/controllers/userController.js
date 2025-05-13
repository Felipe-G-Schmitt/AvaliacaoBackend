const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10;
const JWT_SECRET_KEY = 'fepers';

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

        const user = await User.create({ nome, email, senha: senhaCriptografada });

        return res.status(201).json(user)
    }

    async login(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    }

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

        user.nome = nome;
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

        res.status(204).send();
    }
}

module.exports = (new UserController())