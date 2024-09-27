import express from "express";
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js'

const app = express();  //extrae la función para ejecutar express
app.use(express.json());    //se especifica qe se va a enviar datos de tipo json

dotenv.config();    //scan .env files

conectarDB();

app.use('/api/veterinarios', veterinarioRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`servidor funcionando en el puerto ${PORT}`);
});

