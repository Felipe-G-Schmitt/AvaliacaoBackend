const NotFound = require('../errors/not-found');
const MissingValues = require('../errors/missing-values');
const ProdOrder = require('../models/prodOrder');
const Order = require('../models/order');
const Product = require('../models/product');
const { generateOrderLinks } = require('../utils/hypermedia');

class OrderController {
    async getOrder(req, res) {
        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
                through: {
                    attributes: ['quantity'], 
                }
            }]
        });

        const ordersWithLinks = orders.map(order => generateOrderLinks(order.toJSON())); //hypermidia
        if (!ordersWithLinks || ordersWithLinks.length === 0) {
            throw new NotFound('Nenhum pedido encontrado');
        }

        return res.json(ordersWithLinks);
    }

    async getOrderById(req, res) {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [{
            model: Product,
            as: 'products',
            through: {
                attributes: ['quantity'], 
            }
            }]
        });
        const orderWithLinks = generateOrderLinks(order.toJSON()); //hypermidia

        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        return res.json(orderWithLinks);
    }

    async createOrder(req, res) {
        const { userId, products } = req.body;

        if (!userId || !Array.isArray(products) || products.length === 0) {
            throw new MissingValues({ userId, products });
        }

        const order = await Order.create({ userId });
        

        const items = products.map(p => ({
            orderId: order.id,
            productId: p.productId,
            quantity: p.quantity
        }));

        await ProdOrder.bulkCreate(items); 

        const newOrder = await Order.findByPk(order.id, {
            include: [{
            model: Product,
            as: 'products',
            through: { attributes: ['quantity'] }
            }]
        });

        const orderWithLinks = generateOrderLinks(order.toJSON()); //hypermidia

        res.status(201).json(orderWithLinks);
        res.status(201).json({ order: newOrder });
    }

    async UpdateOrder(req, res) {
        const { id } = req.params;
        const { userId, products } = req.body;

        if (!userId || !Array.isArray(products) || products.length === 0) {
            throw new MissingValues({ userId, productId, quantity });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        order.userId = userId;
        await order.save();

        // Tira os produtos antigos
        await ProdOrder.destroy({ where: { orderId: id } });

        // Cria novos
        const newItems = products.map(p => ({
            orderId: id,
            productId: p.productId,
            quantity: p.quantity
        }));

        // Cria de uma vez
        await ProdOrder.bulkCreate(newItems);

        // Procura o pedido atualizado
        const updatedOrder = await Order.findByPk(id, {
            include: [{
                model: Product,
                as: 'products',
                through: { attributes: ['quantity'] }
            }]
        });

        const orderWithLinks = generateOrderLinks(updatedOrder.toJSON());

        return res.json(orderWithLinks);
    }

    async DeleteOrder(req, res) {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        await order.destroy();

        res.status(200).json({ 
            message: "Pedido deletado",
                links: [
                { rel: "create", method: "POST", href: "/order" },
                { rel: "all", method: "GET", href: "/order" }
            ]
        });
    }
}

module.exports = new OrderController();