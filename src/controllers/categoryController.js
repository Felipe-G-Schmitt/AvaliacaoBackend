const Conflict = require('../errors/conflict');
const MissingValues = require('../errors/missing-values');
const NotFound = require('../errors/not-found');
const Category = require('../models/category')

class categoryController {
    async getCategory(req, res) {
        const categories = await Category.findAll();
        return res.json(categories);
    }

    async getCategoryById(req, res) {  
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            throw new NotFound(`Categoria com ID ${id} não encontrada`);
        }

        res.json(category);
    }

    async createCategory(req, res) {
        const { nome } = req.body;
        if (!nome) {
            throw new MissingValues({ nome });
        }

        const categoriaExiste = await Category.findOne({ where: { name: nome } });
        if (categoriaExiste) {
            throw new Conflict(`A categoria ${nome} já existe`);
        }

        const category = await Category.create({ name: nome });

        res.status(201).json(category);
    }

    async UpdateCategory(req, res) {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome) {
            throw new MissingValues({ nome });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            throw new NotFound(`Categoria com ID ${id} não encontrada`);
        }

        const categoriaExiste = await Category.findOne({ where: { name: nome } });
        if (categoriaExiste && categoriaExiste.id !== id) {
            throw new Conflict(`A categoria ${nome} já existe`);
        }

        category.name = nome;

        await category.save();

        res.json(category);
    }

    async DeleteCategory(req, res) {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            throw new NotFound(`Categoria com ID ${id} não encontrada`);
        }

        await category.destroy();

        res.status(204).send({ message: "Categoria deletado" });
    }
}

module.exports = (new categoryController())