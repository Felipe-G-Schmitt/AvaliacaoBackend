const database = require('../config/database');

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
    }
}