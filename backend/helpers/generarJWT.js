import jwt from 'jsonwebtoken'

const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {    //esta es la informacion qe tendra el jsonwebtoken { nombre: 'William' } si alguien descifra el jsonwebtoken en jwt.io va a ver esa informacion se debe etener cuidado de no poner datos sensibles
        expiresIn: '30d'
    });
};

export default generarJWT;