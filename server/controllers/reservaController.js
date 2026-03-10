import waitinglist from '../models/waitinglist.js';
import typeevents from '../models/typeevents.js';
import nodemailer from 'nodemailer';
import { templateConfirmacao } from '../services/emailTemplate.js';

const emailAvisoAgendamento = async ({ emailCliente, nomeCliente, dataMarcacao, horaMarcacao }) => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        });

        const icsContent = templateConfirmacao({ nomeCliente, dataMarcacao, horaMarcacao });

        const info = await transporter.sendMail({
            from: 'Teste sistema',
            to: emailCliente,
            subject: 'Confirmação de agendamento',
            html: `<h2>Olá ${nomeCliente}</h2><p>Agendamento confirmado.</p><p>Data: ${dataMarcacao}</p><p>Hora: ${horaMarcacao}</p>`,
            attachments: [
                {
                    filename: 'agendamento.ics',
                    content: icsContent,
                    contentType: 'text/calendar',
                }
            ]
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

        await emailAvisoAgendamento({ emailCliente, nomeCliente, dataMarcacao, horaMarcacao });

        res.status(201).json({ success: true, message: 'Reserva criada com sucesso', waitinglist: novaReserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Verifique os inputs' });
    }
};

const listarEspecialidades = async (req, res) => {
    try {
        const especialidades = await typeevents.findAll({ where: { in_event: 1 } });
        return res.status(200).json({ success: true, message: 'Todas as especialidades listadas', data: especialidades });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'não foi possivel listar todas as especialidades', error: error.message });
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

export { adicionarReserva, listarEspecialidades, listarSeguros };