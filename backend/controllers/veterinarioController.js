import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId,js";
import { request } from "express";

export const registrar = async (req, res) => {
    //const {nombre, email, password} = req.body;  //cuando se define en server.js app.use(express.json()), se habilita la lectura de los json, en este caso tambien se hace destructuring

    const { email } = req.body;

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});    //email: email se va a buscar el objeto email en la columna email
    //a findOne se le puede mandar un objeto, por eso va entre llaves, por ejemplo findOne({ nombre, email, password }), esto buscaria un registro qe coincida con todos los valores

    if(existeUsuario){
        const error = new Error('usuario ya registrado');
        return res.status(400).json({ msg: error.message});
    }

    try{
        //guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);  //se puede crear el objeto directamente desde el envio del json, si se envia una variable qe no necesita el objeto solo se ignora
        const veterinarioGuardado = await veterinario.save();

        res.json({ msg: 'veterinario guardado' });   //res.send muestra en pantalla del navegador
    }catch(error){
        console.log(error);
    }
};

export const confirmar = async (req, res) => {
    const { token } = req.params; //cuando es de la url es params, cuando es el valor qe un usuario llena es req.body

    const usuarioConfirmar = await Veterinario.findOne({ token });  //token : token

    if(!usuarioConfirmar){
        const error = new Error('token no valido');
        return res.status(404).json({ msg: error.message });
    }

    try{
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: 'usuario confirmado correctamente' });
    }catch(error){
        console.log(error);
    }
}

export const autenticar = async (req, res) => {
    const { email, password } = req.body;
    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });

    if(!usuario){
        const error = new Error('el usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    //comprobar si el usuario esta confirmado, cuando ya creo su correo y qiere loguearse pero aun no ha sido confirmado
    if(!usuario.confirmado){
        const error = new Error('tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    //revisar el password
    if(await usuario.comprobarPassword(password)){  //este metodo personalizado fue registrado en el modelo usuario veterinarioSchema.methods.comprobarPassword
        console.log(usuario);
        //autenticar
        res.json({ token: generarJWT(usuario.id) });
    }else{
        const error = new Error('el password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
}

export const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    const existeVeterinario = await Veterinario.findOne({ email });
    if(!existeVeterinario){
        const error = new Error('el usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try{
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json( {msg: 'hemos enviado un email con las instrucciones' });
    }catch(error){
        console.log(error);
    }
}

export const comprobarToken = async (req, res) => {
    const { token } = req.params;
    
    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido){
        //el token es válido el usuario existe
        res.json({ msg: 'token valido' });
    }else{
        const error = new Error('token no valido');
        return res.status(400).json({ msg: error.message });
    }
}

export const nuevoPassword = async (req, res) => {

    const { token } = req.params
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario){
        const error = new Error('hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try{
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'password modificado correctamente' });
    }catch(error){
        console.log(error);
    }
}

export const perfil = (req, res) => {
    const { veterinario } = req;
    res.json({ "perfil": veterinario });
};