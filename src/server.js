const express = require('express');
const database = require('./config/database');
const userController = require('./controllers/userController');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.post('/register', userController.createUser);
app.post('/login', userController.login);

app.use('/api', userRoutes);

database.db.sync({ force: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000')
        })
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });