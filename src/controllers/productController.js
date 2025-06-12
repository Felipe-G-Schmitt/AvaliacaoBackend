const NotFound = require('../errors/not-found');
const Product = require('../models/product')

class productController {
    async getProduct(req, res) {
        const products = await Product.findAll();
        return res.json(products);
    }

    async getProductById(req, res) {  
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            throw new NotFound(`Produto com ID ${id} não encontrado`);
        }

        res.json(product);
    }

    async createProduct(req, res) {
        const { nome, preco, categoryId } = req.body;
        if (!nome || !preco || !categoryId) {
            return res.status(400).json({ message: "Nome, preço e categoria são obrigatórios" });
        }

        const produtoExiste = await Product.findOne({ where: { name: nome } });
        if (produtoExiste) {
            return res.status(409).json({ message: "Esse produto já existe" });
        }

        const product = await Product.create({ name: nome, price : preco, categoryId: categoryId });

        res.status(201).json(product);
    }

    async UpdateProduct(req, res) {
        const { id } = req.params;
        const { nome, preco, categoryId } = req.body;

        if (!nome || !preco || !categoryId) {
            return res.status(400).json({ message: "Nome, preço e categoria são obrigatórios" });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFound(`Produto com ID ${id} não encontrado`);
        }

        const produtoExiste = await Product.findOne({ where: { name: nome } });
        if (produtoExiste && produtoExiste.id !== id) {
            return res.status(409).json({ message: "Esse produto já existe" });
        }

        product.name = nome;
        product.price = preco;
        product.categoryId = categoryId;

        await product.save();

        res.json(product);
    }

    async DeleteProduct(req, res) {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFound(`Produto com ID ${id} não encontrado`);
        }

        await product.destroy();

        res.status(204).send({ message: "Produto deletado" });
    }
}

module.exports = (new productController())