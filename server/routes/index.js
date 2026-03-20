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
    horasOcupadasGeral,
    listarFuncionarios,
} from '../controllers/reservaController.js';
import { loginAdmin, guardarLinks, buscarLinks, adicionarNovoAdmin, listarAdmins } from '../controllers/formularioController.js';

const router = express.Router();

router.post('/adicionarReserva', adicionarReserva);
router.get('/listarEspecialidades', listarEspecialidades);
router.get('/listarSeguros', listarSeguros);
router.get('/listarMarcacoes', listarMarcacoes);
router.get('/horasOcupadas', horasOcupadas);
router.get('/horasOcupadasGeral', horasOcupadasGeral);
router.get('/buscarDisponibilidade', buscarDisponibilidade);
router.post('/novaMarcacao', novaMarcacao);
router.post('/loginAdmin', loginAdmin);

router.post('/adminPage', (req, res) => {
    if (req.body.link_instagram !== undefined || req.body.link_facebook !== undefined) {
        guardarLinks(req, res);
    } else if (req.body.nome && req.body.password) {
        adicionarNovoAdmin(req, res);
    } else {
        res.status(400).json({success: false, message: 'Requisição inválida'});
    }
});

router.get('/adminPage', buscarLinks);
router.get('/buscarLinks', buscarLinks);
router.get('/buscarDisponibilidadeGeral', buscarDisponibilidadeGeral);
router.get('/listarFuncionarios', listarFuncionarios);
router.get('/listarAdmins', listarAdmins);

export default router;