const database = require('../config/database');

class Order {
    constructor() {
        this.model = database.db.define('orders', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            }
        });
    }
}

module.exports = (new Order).model;