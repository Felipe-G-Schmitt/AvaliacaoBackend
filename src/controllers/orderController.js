const Order = require('../models/order');

class OrderController {
    async getOrder(req, res) {
        const orders = await Order.findAll();
        return res.json(orders);
    }

    async getOrderById(req, res) {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        res.json(order);
    }

    async createOrder(req, res) {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: "Usuário, produto e quantidade são obrigatórios" });
        }

        const order = await Order.create({ userId, productId, quantity });

        res.status(201).json(order);
    }

    async UpdateOrder(req, res) {
        const { id } = req.params;
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: "Usuário, produto e quantidade são obrigatórios" });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" });
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
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        await order.destroy();

        res.status(204).send({ message: "Pedido deletado" });
    }

}

module.exports = new OrderController();