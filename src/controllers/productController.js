const NotFound = require('../errors/not-found');
const MissingValues = require('../errors/missing-values');
const Conflict = require('../errors/conflict');
const Product = require('../models/product')
const { generateProductLinks } = require('../utils/hypermedia');

class productController {
    async getProduct(req, res) {
        const products = await Product.findAll(); 
        const productWithLinks = products.map(product => generateProductLinks(product.toJSON())); // hypermidia

        if (!products || products.length === 0) {
            throw new NotFound('Nenhum produto encontrado');
        }

        return res.json(productWithLinks);
    }

    async getProductById(req, res) {
        const { id } = req.params;
        const product = await Product.findByPk(id); 

        if (!product) throw new NotFound(`Produto com ID ${id} não encontrado`);

        return res.json(generateProductLinks(product.toJSON())); //hypermidia
    }

    async createProduct(req, res) {
        const { nome, preco, categoryId } = req.body;
        if (!nome || !preco || !categoryId) {
            throw new MissingValues({ nome, preco, categoryId });
        }

        const produtoExiste = await Product.findOne({ where: { name: nome } });
        if (produtoExiste) {
            throw new Conflict(`O produto ${nome} já existe`);
        }

        const product = await Product.create({ name: nome, price : preco, categoryId: categoryId }); 
        const productWithLinks = generateProductLinks(product.toJSON()); //hypermidia

        res.status(201).json(productWithLinks);
    }

    async UpdateProduct(req, res) {
        const { id } = req.params;
        const { nome, preco, categoryId } = req.body;

        if (!nome || !preco || !categoryId) {
            throw new MissingValues({ nome, preco, categoryId });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFound(`Produto com ID ${id} não encontrado`);
        }

        const produtoExiste = await Product.findOne({ where: { name: nome } });
        if (produtoExiste && produtoExiste.id !== id) {
            throw new Conflict(`O produto ${nome} já existe`);
        }

        product.name = nome;
        product.price = preco;
        product.categoryId = categoryId;

        await product.save();

        const productWithLinks = generateProductLinks(product.toJSON()); //hypermidia

        res.json(productWithLinks);
    }

    async DeleteProduct(req, res) {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFound(`Produto com ID ${id} não encontrado`);
        }
        
        await product.destroy();
        
        res.status(200).send({ 
            message: "Produto deletado",
                links: [
                { rel: "create", method: "POST", href: "/product" },
                { rel: "all", method: "GET", href: "/product" }
            ]
        });
    }
}

module.exports = (new productController())