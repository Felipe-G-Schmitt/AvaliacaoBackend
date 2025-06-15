const User = require('../models/user')
const bcrypt = require('bcrypt')
const NotFound = require('../errors/not-found');
const MissingValues = require('../errors/missing-values');
const Conflict = require('../errors/conflict');
const EmailValidade = require('../errors/email-validate');
const { generateUserLinks } = require('../utils/hypermedia');

const saltRounds = 10;

class UserController {
    async createUser(req, res) {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            throw new MissingValues({ nome, email, senha});
        }

        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            throw new EmailValidade(email);
        }

        const emailExiste = await User.findOne({ where: { email } });
        if (emailExiste) {
            throw new Conflict(`O email ${email} já pertence a outro usuário`);
        }

        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const user = await User.create({ name: nome, email, password: senhaCriptografada });

        return res.status(201).json(user)
    }

    async getUser(req, res) {
        const users = await User.findAll();
        const usersWithLinks = users.map(user => generateUserLinks(user.toJSON()));

        if( !users || users.length === 0) {
            throw new NotFound('Nenhum usuário encontrado');
        }
        
        return res.json(usersWithLinks);
    }

    async getUserById(req, res) {  
        const { id } = req.params;
        const user = await User.findByPk(id);
        const userWithLinks = generateUserLinks(user.toJSON());

        if (!user) {
            throw new NotFound(`Usuário com ID ${id} não encontrado`);
        }

        return res.json(userWithLinks);
    }

    async UpdateUser(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            throw new MissingValues({ nome, email, senha });
        }

        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFound(`Usuário com ID ${id} não encontrado`);
        }

        const emailExiste = await User.findOne({ where: { email } });
        if (emailExiste && emailExiste.id !== id) {
            throw new Conflict(`O email ${email} já pertence a outro usuário`);
        }

        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        user.name = nome;
        user.email = email;
        user.password = senhaCriptografada;

        await user.save();    
        
        const userWithLinks = generateUserLinks(user.toJSON());

        res.json(userWithLinks);
    }

    async DeleteUser(req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new NotFound(`Usuário com ID ${id} não encontrado`);
        }

        await user.destroy();

        res.status(200).json({
            message: "Usuário deletado com sucesso",
                links: [
                { rel: "create", method: "POST", href: "/user" },
                { rel: "all", method: "GET", href: "/user" }
            ]
        });
    }
}

module.exports = (new UserController())