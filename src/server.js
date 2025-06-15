const express = require('express');
const database = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authMiddle = require('./middlewares/authMiddle');
const loginMiddle = require('./middlewares/loginMiddle');
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

app.use('/api', registerRoutes);
app.post('/api/login', loginMiddle.login);

app.use(authMiddle.ValidarToken);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

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
        })
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });