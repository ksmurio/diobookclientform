import express from 'express';
import { adicionarReserva, listarEspecialidades, listarSeguros } from '../controllers/reservaController.js';
import { loginAdmin, guardarLinks, buscarLinks} from '../controllers/formularioController.js';

const router = express.Router();

router.post('/adicionarReserva', adicionarReserva);
router.get('/listarEspecialidades', listarEspecialidades);
router.post('/loginAdmin', loginAdmin);
router.post('/adminPage', guardarLinks);
router.get('/buscarLinks', buscarLinks);
router.get('/listarSeguros', listarSeguros);
router.get('/adminPage', buscarLinks);

export default router;