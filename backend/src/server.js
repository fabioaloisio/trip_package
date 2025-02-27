require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const packagesRoutes = require('./routes/packages.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Rotas para servir páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/login.html'));
});

app.get('/package-details', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/package-details.html'));
});

// Rota para servir o template do header
app.get('/templates/header', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/templates/header.html'));
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/packages', packagesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
