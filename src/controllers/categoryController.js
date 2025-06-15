const Conflict = require('../errors/conflict');
const MissingValues = require('../errors/missing-values');
const NotFound = require('../errors/not-found');
const Category = require('../models/category')
const { generateCategoryLinks } = require('../utils/hypermedia');

class categoryController {
    async getCategory(req, res) {
        const categories = await Category.findAll();
        const categoriesWithLinks = categories.map(category => generateCategoryLinks(category.toJSON())); // hypermidia

        if (!categories || categories.length === 0) {
            throw new NotFound('Nenhuma categoria encontrada');
        }

        return res.json(categoriesWithLinks);
    }

    async getCategoryById(req, res) {  
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            throw new NotFound(`Categoria com ID ${id} não encontrada`);
        }

        return res.json(generateCategoryLinks(category.toJSON)); // hypermidia
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
        const categoryWithLinks = generateCategoryLinks(category.toJSON()); // hypermidia

        res.status(201).json(categoryWithLinks);
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

        const categoryWithLinks = generateCategoryLinks(category.toJSON()); // hypermidia
        res.json(categoryWithLinks);
    }

    async DeleteCategory(req, res) {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            throw new NotFound(`Categoria com ID ${id} não encontrada`);
        }

        await category.destroy();

        res.status(200).send({ 
            message: "Categoria deletado",
                links: [
                { rel: "create", method: "POST", href: "/categories" },
                { rel: "all", method: "GET", href: "/categories" }
            ]
        });
    }
}

module.exports = (new categoryController())