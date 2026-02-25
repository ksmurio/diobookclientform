import express from 'express';
import { adicionarReserva } from '../controllers/reservaController.js';
import {  listarEspecialidades } from '../controllers/reservaController.js';
import { loginAdmin } from '../controllers/formularioController.js';
import { guardarLinks } from "../controllers/formularioController.js";

const router = express.Router();

router.post('/adicionarReserva', adicionarReserva);
router.get('/listarEspecialidades', listarEspecialidades);
router.post('/loginAdmin', loginAdmin);
router.post('/guardarLinks', guardarLinks)


export default router;