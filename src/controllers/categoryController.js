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
            return res.status(404).json({ message: "Categoria não encontrado" });
        }

        res.json(category);
    }

    async createCategory(req, res) {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: "Nome obrigatório" });
        }

        const categoriaExiste = await Category.findOne({ where: { name: nome } });
        if (categoriaExiste) {
            return res.status(400).json({ message: "Essa categoria já existe" });
        }

        const category = await Category.create({ name: nome });

        res.status(201).json(category);
    }

    async UpdateCategory(req, res) {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ message: "Nome obrigatório" });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const categoriaExiste = await Category.findOne({ where: { name: nome } });
        if (categoriaExiste && categoriaExiste.id !== id) {
            return res.status(400).json({ message: "Essa categoria já existe" });
        }

        category.name = nome;

        await category.save();

        res.json(category);
    }

    async DeleteCategory(req, res) {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }

        await category.destroy();

        res.status(204).send({ message: "Categoria deletado" });
    }
}

module.exports = (new categoryController())