const database = require('../config/database');

class Product {
    constructor() {
        this.model = database.db.define('products', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: database.db.Sequelize.STRING
            },
            price: {
                type: database.db.Sequelize.FLOAT
            },
            categoryId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            },
        });
    }
}

module.exports = (new Product).model;