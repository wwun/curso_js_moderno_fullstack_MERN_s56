import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId,js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        tri: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function(next){   //pre es el middleware de mongoose, se usa function() porqe this en function hace referencia al objeto actual y con arrow function se hace referencia a la ventana global
    //con this de arrow function si se imprime this el valor es undefined, con function this imprime el objeto
    if(!this.isModified('password')){   //para qe un password qe ya esta hasheado no lo vuelva a hashear
        next();                         //pasa a la siguiente linea (en node se llaman middleware)
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password); //this.password es el password hasheado
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;