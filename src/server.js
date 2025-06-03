const express = require('express');
const database = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const registerMiddle = require('./middlewares/registerMiddle');
const loginMiddle = require('./middlewares/loginMiddle');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());

app.post('/register', registerMiddle.createUser);
app.post('/login', loginMiddle.login);

app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

database.db.sync({ force: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000')
        })
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });