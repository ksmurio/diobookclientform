import express from 'express';
import {
    adicionarReserva,
    listarEspecialidades,
    listarSeguros,
    listarMarcacoes,
    horasOcupadas,
    buscarDisponibilidade,
    buscarDisponibilidadeGeral,
    novaMarcacao,
} from '../controllers/reservaController.js';
import { loginAdmin, guardarLinks, buscarLinks } from '../controllers/formularioController.js';

const router = express.Router();

router.post('/adicionarReserva', adicionarReserva);
router.get('/listarEspecialidades', listarEspecialidades);
router.get('/listarSeguros', listarSeguros);
router.get('/listarMarcacoes', listarMarcacoes);
router.get('/horasOcupadas', horasOcupadas);
router.get('/buscarDisponibilidades', buscarDisponibilidade);
router.post('/novaMarcacao', novaMarcacao);
router.post('/loginAdmin', loginAdmin);
router.post('/adminPage', guardarLinks);
router.get('/adminPage', buscarLinks);
router.get('/buscarLinks', buscarLinks);
router.get('/buscarDisponibilidadesGeral', buscarDisponibilidadeGeral);

export default router;