import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';


export const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); //con select('-variable) omite la variable para no traerse el password
            //req.veterinario ya no se almancena en la variable sino una sesion con la información
            return next();
        }catch(e){
            const error = new Error('Token no válido');
            res.status(403).json({ msg: error.message });        
        }
    }
    
    if(!token){
        const error = new Error('Token no válido o inexistente');
        res.status(403).json({ msg: error.message });        
    }

    next();
}

//export default checkAuth;