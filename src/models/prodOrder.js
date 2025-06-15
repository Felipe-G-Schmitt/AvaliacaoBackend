const database = require('../config/database');
const Order = require('./order');
const Product = require('./product');

class ProdOrder {
    constructor() {
        this.model = database.db.define('prodOrders', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            quantity: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false
            },
            orderId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            productId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id'
                }
            }
        });

        Order.belongsToMany(Product, {
            through: this.model,
            as: 'products',
            foreignKey: 'orderId',
            otherKey: 'productId'
        });

        Product.belongsToMany(Order, {
            through: this.model,
            as: 'orders',
            foreignKey: 'productId',
            otherKey: 'orderId'
        });

    }
}

module.exports = (new ProdOrder).model;