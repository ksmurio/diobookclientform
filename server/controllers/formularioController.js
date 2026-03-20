import adminsettings from '../models/adminsettings.js';
import admins from '../models/admins.js';
import users from '../models/users.js';
import bcryptjs from 'bcryptjs';
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const loginAdmin = async (req, res) => {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
        }

        const user = await admins.findOne({ where: { username } });

        if (!user || user.senha !== senha) {
            return res.status(401).json({ success: false, message: 'Username ou Senha Incorretos' });
        }

        return res.status(200).json({ success: true, message: 'Login bem-sucedido', admin: user });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
};

const guardarLinks = async (req, res) => {
    try {
        let {
            link_instagram, link_facebook,
            mostrar_link_instagram, mostrar_link_facebook,
            id_admin,
            naotrabalhasabados, naotrabalhadomingos, naotrabalhasegundas,
            naotrabalhatercas, naotrabalhaQuartas, naotrabalhaQuintas, naotrabalhasextas
        } = req.body;

        if (link_instagram && !link_instagram.startsWith('http://') && !link_instagram.startsWith('https://')) {
            link_instagram = 'https://' + link_instagram;
        }
        if (link_facebook && !link_facebook.startsWith('http://') && !link_facebook.startsWith('https://')) {
            link_facebook = 'https://' + link_facebook;
        }

        const diasNaoTrabalha = {
            naotrabalhasabados,
            naotrabalhadomingos,
            naotrabalhasegundas,
            naotrabalhatercas,
            naotrabalhaQuartas,
            naotrabalhaQuintas,
            naotrabalhasextas
        };

        const userExistente = await adminsettings.findOne({ where: { id_admin } });

        if (userExistente) {
            await userExistente.update({
                link_instagram,
                mostrar_link_instagram,
                link_facebook,
                mostrar_link_facebook,
                ...diasNaoTrabalha
            });
            return res.status(200).json({ success: true, message: 'Links atualizados com sucesso' });
        } else {
            await adminsettings.create({
                id_admin,
                link_instagram,
                mostrar_link_instagram,
                link_facebook,
                mostrar_link_facebook,
                ...diasNaoTrabalha
            });
            return res.status(201).json({ success: true, message: 'Links guardados com sucesso' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível guardar links', error: error.message });
    }
};

const buscarLinks = async (req, res) => {
    try {
        const settings = await adminsettings.findOne({ where: { id_admin: 1 } });

        if (!settings) {
            return res.status(404).json({ success: false, message: 'Definições não encontradas' });
        }

        const diasNaoTrabalha = {
            naotrabalhasabados: settings.naotrabalhasabados === 1,
            naotrabalhadomingos: settings.naotrabalhadomingos === 1,
            naotrabalhasegundas: settings.naotrabalhasegundas === 1,
            naotrabalhatercas: settings.naotrabalhatercas === 1,
            naotrabalhaQuartas: settings.naotrabalhaQuartas === 1,
            naotrabalhaQuintas: settings.naotrabalhaQuintas === 1,
            naotrabalhasextas: settings.naotrabalhasextas === 1,
        };

        return res.status(200).json({
            success: true,
            data: {
                ...settings.dataValues,
                ...diasNaoTrabalha
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro ao buscar links' });
    }
};

const adicionarNovoAdmin = async (req, res) => {
    const { nome, password, especialidade, img, color } = req.body;
    try {
        if (!nome || !password || !especialidade) {
            return res.status(400).json({
                success: false, 
                message: 'Nome, password e especialidade são obrigatórios'
            });
        }

        const buscarAdmin = await users.findOne({ where: { name: nome } });
        if (buscarAdmin) {
            return res.status(400).json({
                success: false, 
                message: 'Nome já utilizado'
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        const novoAdmin = await users.create({
            name: nome,
            userName: nome,
            password: hashedPassword,
            especialidade,
            img: img || null,
            color: color,
            role: 'admin',
            permission_group: 1
        });

        return res.status(201).json({
            success: true, 
            message: 'Admin criado com sucesso',
            data: novoAdmin
        });
    } catch (error) {
        console.log('Erro ao criar admin:', error);
        return res.status(500).json({
            success: false, 
            message: 'Erro ao criar admin',
            error: error.errors
        });
    }
};

const listarAdmins = async (req, res) => {
    try {
        const admins = await users.findAll({ where: { role: 'admin', ativo: 1 } });
        return res.status(200).json({ success: true, data: admins });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível listar funcionários', error: error.message });
    }
};

export { loginAdmin, guardarLinks, buscarLinks, adicionarNovoAdmin, listarAdmins };

