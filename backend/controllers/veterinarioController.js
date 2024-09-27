import Veterinario from "../models/Veterinario.js";

export const registrar = async (req, res) => {
    //const {nombre, email, password} = req.body;  //cuando se define en server.js app.use(express.json()), se habilita la lectura de los json, en este caso tambien se hace destructuring

    const { email } = req.body;

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});    //email: email se va a buscar el objeto email en la columna email

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

export const perfil = (req, res) => {
    res.json({ msg: 'mostrando perfil' });
};