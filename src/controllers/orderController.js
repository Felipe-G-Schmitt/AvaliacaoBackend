const NotFound = require('../errors/not-found');
const MissingValues = require('../errors/missing-values');
const ProdOrder = require('../models/prodOrder');
const Order = require('../models/order');
const Product = require('../models/product');

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
        if (!orders || orders.length === 0) {
            throw new NotFound('Nenhum pedido encontrado');
        }
        return res.json(orders);
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

        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        res.json({ order });
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

        res.status(201).json({ order: newOrder });
    }

    async UpdateOrder(req, res) {
        const { id } = req.params;
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            throw new MissingValues({ userId, productId, quantity });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        order.userId = userId;
        order.productId = productId;
        order.quantity = quantity;

        await order.save();

        res.json(order);
    }

    async DeleteOrder(req, res) {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFound(`Pedido com ID ${id} não encontrado`);
        }

        await order.destroy();

        res.status(204).send({ message: "Pedido deletado" });
    }

}

module.exports = new OrderController();