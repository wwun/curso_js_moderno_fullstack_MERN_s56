import mongoose from 'mongoose';

export const conectarDB = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDb conectado en: ${url}`);
    }catch{
        console.log(`error: ${error.message}`);
        process.exit(1);    //imprime un mensaje de error
    }
}

export default conectarDB;