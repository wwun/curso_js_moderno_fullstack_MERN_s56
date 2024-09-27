import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword } from '../controllers/veterinarioController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

//rutas de acceso público
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword); es lo mismo qe:
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);


//rutas de acceso privado
router.get('/perfil', checkAuth, perfil);   //como checkAuth tiene el next, primero abbre la ruta, ejecuta checkAuth y luego perfil


export default router;