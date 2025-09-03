const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/' , (req, res) => {
    res.send({ message: 'Backend funcionando correctamente' });
});

mongoose.connect('mongodb://localhost:27017/mecanografia', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});


// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});