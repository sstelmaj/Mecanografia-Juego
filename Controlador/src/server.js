require('dotenv').config();
const express = require('express');
const cors = require('cors');
connectDB = require("./config/db");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", require("./rutas/authRoutes"));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});
