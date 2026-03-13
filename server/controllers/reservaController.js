import waitinglist from '../models/waitinglist.js';
import typeevents from '../models/typeevents.js';
import userevents from '../models/userevents.js';
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
    const { nomeCliente, emailCliente, contribuinteCliente, moradaCliente, especialidade, seguro, dataMarcacao, horaMarcacao } = req.body;

    if (!nomeCliente || !emailCliente || !especialidade || !dataMarcacao || !seguro || !horaMarcacao) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
    }

    try {
        const novaReserva = await waitinglist.create({
            nomeCliente,
            emailCliente,
            contribuinteCliente: contribuinteCliente || null,
            moradaCliente: moradaCliente || null,
            especialidade,
            seguro,
            dataMarcacao,
            horaMarcacao,
        });

        await userevents.create({
            start: `${dataMarcacao} ${horaMarcacao}`,
            end: `${dataMarcacao} ${horaMarcacao}`,
            details: `Marcação de ${nomeCliente}`,
            TypeeventId: especialidade,
            invoiced: 0,
        });

        await emailAvisoAgendamento({ emailCliente, nomeCliente, dataMarcacao, horaMarcacao });

        res.status(201).json({ success: true, message: 'Reserva criada com sucesso', waitinglist: novaReserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Verifique os inputs' });
    }
};

const novaMarcacao = async (req, res) => {
    const { WaitinglistId, TypeeventId, dataMarcacao, horaMarcacao } = req.body;

    if (!WaitinglistId || !TypeeventId || !dataMarcacao || !horaMarcacao) {
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
    const { data, especialidadeId } = req.query;
    try {
        const lista = await userevents.findAll({
            where: { TypeeventId: especialidadeId },
            attributes: ['start'],
        });

        const horas = lista
            .map(e => e.start)
            .filter(s => s.startsWith(data))
            .map(s => s.split(' ')[1].substring(0, 5));

        res.status(200).json({ success: true, data: horas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao buscar horas ocupadas' });
    }
};

const buscarDisponibilidade = async (req, res) => {
    const { TypeeventId } = req.query;

    try {
        const eventos = await userevents.findAll({
            where: { TypeeventId },
            attributes: ['id', 'start', 'end', 'TypeeventId'],
        });

        const resultado = eventos.map(e => {
            const startStr = e.start || '';
            const partes = startStr.split(' ');

            const data = partes[0].split('T')[0];
            const horaInicio = partes.length > 1 //para pegar so o 10 o 10:30
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
        res.status(500).json({ success: false, message: 'Erro ao buscar eventos' });
    }
};

const buscarDisponibilidadeAleatorio = async (req, res) => {
    try {
        const eventos = await userevents.findAll({
            attributes: ['id', 'start', 'end', 'TypeeventId'],
        });

        const resultado = eventos.map(e => {
            const startStr = e.start || '';
            const partes = startStr.split(' ');

            const data = partes[0].split('T')[0];
            const horaInicio = partes.length > 1
                ? partes[partes.length - 1].substring(0, 5) : startStr.substring(11, 16);

            return {
                id: e.id,
                TypeeventId: e.TypeeventId,
                data,
                horaInicio,
            };
            res.status(200).json({ success: true, data: resultado });
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Erro ao buscar eventos' });
    }
}

const listarEspecialidades = async (req, res) => {
    try {
        const especialidades = await typeevents.findAll({ where: { in_event: 1 } });
        return res.status(200).json({ success: true, data: especialidades });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível listar especialidades', error: error.message });
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

export { adicionarReserva, novaMarcacao, listarMarcacoes, horasOcupadas, listarEspecialidades, listarSeguros, buscarDisponibilidade };