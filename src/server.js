const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./docs/swagger');
const database = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authMiddle = require('./middlewares/authMiddle');
const loginRoutes = require('./routes/loginRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const registerRoutes = require('./routes/registerRoutes');
const errorHandler = require('./errors/errorMiddle');

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('API de Avaliação Backend');
});

app.use(registerRoutes);
app.use(loginRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.use('/api', authMiddle.ValidarToken, userRoutes);
app.use('/api', authMiddle.ValidarToken, categoryRoutes);
app.use('/api', authMiddle.ValidarToken, productRoutes);
app.use('/api', authMiddle.ValidarToken, orderRoutes);

app.use((err, req, res, next) => {
    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    throw new errorHandler(err, req, res, next);
});


database.db.sync({ force: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000')
            console.log('Swagger: http://localhost:3000/api-docs');
        })
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });