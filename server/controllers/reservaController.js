import waitinglist from '../models/waitinglist.js';
import typeevents from '../models/typeevents.js';
import userevents from '../models/userevents.js';
import users from '../models/users.js';
import nodemailer from 'nodemailer';
import { templateConfirmacao } from '../services/emailTemplate.js';

const emailAvisoAgendamento = async ({ emailCliente, nomeCliente, dataMarcacao, horaMarcacao }) => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
        const icsContent = templateConfirmacao({ nomeCliente, dataMarcacao, horaMarcacao });
        const info = await transporter.sendMail({
            from: 'Teste sistema',
            to: emailCliente,
            subject: 'Confirmação de agendamento',
            html: `<h2>Olá ${nomeCliente}</h2><p>Agendamento confirmado.</p><p>Data: ${dataMarcacao}</p><p>Hora: ${horaMarcacao}</p>`,
            attachments: [{ filename: 'agendamento.ics', content: icsContent, contentType: 'text/calendar' }]
        });
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
};

const adicionarReserva = async (req, res) => {
    const { nomeCliente, emailCliente, contribuinteCliente, moradaCliente, especialidade,dataMarcacao, horaMarcacao, userId } = req.body;

    if (!nomeCliente || !emailCliente || !dataMarcacao || !horaMarcacao) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
    }

    const transaction = await userevents.sequelize.transaction({
        isolationLevel: 'READ COMMITTED'
    });

    try {
        const marcacaoExistente = await userevents.sequelize.query(
            `SELECT id FROM userevents WHERE start = :start AND UserId = :userId FOR UPDATE`,
            {
                replacements: { 
                    start: `${dataMarcacao} ${horaMarcacao}`,
                    userId 
                },
                type: userevents.sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        if (marcacaoExistente.length > 0) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: 'Este horário já está ocupado' });
        }

        const typeevent = await typeevents.findByPk(especialidade);
        const duracaoMinutos = typeevent?.duration
            ? parseInt(typeevent.duration.split(':')[1])
            : 30;

        const [horas, minutos] = horaMarcacao.split(':').map(Number);
        const totalMinutos = horas * 60 + minutos + duracaoMinutos;
        const horaFim = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

        const novaMarcacao = await waitinglist.create({
            nomeCliente,
            emailCliente,
            contribuinteCliente: contribuinteCliente || null,
            moradaCliente: moradaCliente || null,
            especialidade: especialidade || null,
            dataMarcacao,
            horaMarcacao,
        }, { transaction });

        const novaReserva = await userevents.create({
            start: `${dataMarcacao} ${horaMarcacao}`,
            end: `${dataMarcacao} ${horaFim}`,
            details: `Marcação de ${nomeCliente}`,
            TypeeventId: especialidade || null,
            invoiced: 0,
            UserId: userId,
        }, { transaction });

        await transaction.commit();
        await emailAvisoAgendamento({ emailCliente, nomeCliente, dataMarcacao, horaMarcacao });

        res.status(201).json({ success: true, message: 'Reserva criada com sucesso', reserva: novaReserva });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao criar reserva', error: error.message });
    }
};

const novaMarcacao = async (req, res) => {
/*    const { WaitinglistId, TypeeventId, dataMarcacao, horaMarcacao } = req.body;

    if (!WaitinglistId || !dataMarcacao || !horaMarcacao) {
        return res.status(400).json({ success: false, message: 'WaitinglistId, TypeeventId, data e hora são obrigatórios' });
    }

    try {
        const waiting = await waitinglist.findByPk(WaitinglistId);
        if (!waiting) return res.status(404).json({ success: false, message: 'Waitinglist não encontrado' });

        const typeevent = await typeevents.findByPk(TypeeventId);
        if (!typeevent) return res.status(404).json({ success: false, message: 'Profissional não encontrado' });

        const marcacao = await userevents.create({
            start: `${dataMarcacao} ${horaMarcacao}`,
            end: `${dataMarcacao} ${horaMarcacao}`,
            details: waiting.nomeCliente,
            TypeeventId,
            invoiced: 0,
        });

        res.status(201).json({ success: true, message: 'Marcação criada com sucesso', marcacao });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao criar marcação' });
    }  
        */
};

const listarMarcacoes = async (req, res) => {
    const { seguroId } = req.query;
    try {
        const where = {};
        if (seguroId) where.TypeeventId = seguroId;
        const lista = await userevents.findAll({ where });
        res.status(200).json({ success: true, data: lista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao listar marcações' });
    }
};

const horasOcupadas = async (req, res) => {
    const { data, especialidadeId, userId } = req.query;
    try {
        const where = {};
        if (userId) {
            where.UserId = userId;  
        } else if (especialidadeId) {
            where.TypeeventId = especialidadeId;
        }

        const lista = await userevents.findAll({
            where,
            attributes: ['start'],
        });

        const horas = lista
            .map(e => e.start) 
            .filter(s => s.startsWith(data))
            .map(s => s.split(' ')[1]?.substring(0, 5))
            .filter(Boolean); 

        res.status(200).json({ success: true, data: horas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao buscar horas ocupadas' });
    }
};

const horasOcupadasGeral = async (req, res) => {
    const { data, especialidade } = req.query;
    try {
        const totalEmployees = await users.count({
            where: { especialidade: especialidade, role: 'employee' }
        });

        if (totalEmployees === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const lista = await userevents.findAll({
            where: { TypeeventId: especialidade },
            attributes: ['start', 'UserId'],
        });

        const marcacoesNoDia = lista.filter(e => e.start.startsWith(data));
        const ocupadosPorHora = {};
        marcacoesNoDia.forEach(e => {
            if (!e.UserId) return;
            const hora = e.start.split(' ')[1]?.substring(0, 5);
            if (!hora) return;
            if (!ocupadosPorHora[hora]) ocupadosPorHora[hora] = new Set();
            ocupadosPorHora[hora].add(e.UserId);
        });
        const horasBloqueadas = Object.keys(ocupadosPorHora).filter(hora =>
            ocupadosPorHora[hora].size >= totalEmployees
        );

        res.status(200).json({ success: true, data: horasBloqueadas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao buscar horas' });
    }
};

const buscarDisponibilidade = async (req, res) => {
    const { funcionario } = req.query; 
    try {
        const eventos = await userevents.findAll({
            where: { UserId: funcionario }, 
            attributes: ['id', 'start', 'end', 'TypeeventId'],
        });

        const resultado = eventos.map(e => {
            const startStr = e.start || '';
            const partes = startStr.split(' ');
            const data = partes[0].split('T')[0];
            const horaInicio = partes.length > 1
                ? partes[partes.length - 1].substring(0, 5)
                : startStr.substring(11, 16);

            return {
                id: e.id,
                TypeeventId: e.TypeeventId,
                data,
                horaInicio,
            };
        });

        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao buscar eventos', error: error.message });
    }
};

const buscarDisponibilidadeGeral = async (req, res) => {
    const { especialidade } = req.query;
    try {
        // ✅ Conta funcionários (employees) com essa especialidade
        const totalProfissionais = await users.count({ 
            where: { especialidade: especialidade, role: 'employee' } 
        });

        if (totalProfissionais === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // ✅ Busca eventos do tipo desta especialidade
        const lista = await userevents.findAll({
            where: { TypeeventId: especialidade },
            attributes: ['start', 'UserId'],
        });

        const ocupadosPorDiaHora = {};
        lista.forEach(e => {
            if (!e.UserId) return;
            const startStr = e.start || '';
            const partes = startStr.split(' ');
            const dia = partes[0].split('T')[0];
            if (partes.length < 2) return;
            const hora = partes[partes.length - 1].substring(0, 5);
            if (!ocupadosPorDiaHora[dia]) ocupadosPorDiaHora[dia] = {};
            if (!ocupadosPorDiaHora[dia][hora]) ocupadosPorDiaHora[dia][hora] = new Set();
            ocupadosPorDiaHora[dia][hora].add(e.UserId);
        });

        const resultado = [];
        Object.keys(ocupadosPorDiaHora).forEach(dia => {
            Object.keys(ocupadosPorDiaHora[dia]).forEach(hora => {
                if (ocupadosPorDiaHora[dia][hora].size >= totalProfissionais) {
                    resultado.push({ data: dia, horaInicio: hora });
                }
            });
        });

        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao buscar eventos', error: error.message });
    }
};

const listarEspecialidades = async (req, res) => {
    try {
        const especialidades = await typeevents.findAll({ where: { in_event: 1 } });
        return res.status(200).json({ success: true, data: especialidades });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível listar especialidades', error: error.message });
    }
};

const listarFuncionarios = async (req, res) => {
    try {
        const { especialidade } = req.query;
        const funcionarios = await users.findAll({ where: { especialidade } });
        return res.status(200).json({ success: true, data: funcionarios });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível listar funcionários', error: error.message });
    }
};


const listarSeguros = async (req, res) => {
    try {
        const seguros = await typeevents.findAll({
            where: { invoice: 1 },
            attributes: ['id', 'name'],
        });
        return res.status(200).json({ success: true, data: seguros });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro ao listar seguros', error: error.message });
    }
};

export { adicionarReserva, novaMarcacao, listarMarcacoes, horasOcupadas, listarEspecialidades, buscarDisponibilidadeGeral, listarSeguros, buscarDisponibilidade, horasOcupadasGeral, listarFuncionarios };