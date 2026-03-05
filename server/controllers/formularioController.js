import adminsettings from '../models/adminsettings.js';
import admins from '../models/admins.js'

const loginAdmin = async (req,res) => {
    try{
        const {username, senha} = req.body;
        const user = await admins.findOne({where:{username}});

        if(!user){
            return res.status(401).json({success:false,message: 'Username ou Senha Incorretos'});
        }

        if(user.senha !== senha){
            return res.status(401).json({success:false, message: 'Username ou Senha Incorretos'}); //Alterar para virar HASH !!!!importante
        }else{
            return res.status(200).json({success:true, message: 'Login bem-sucedido'});
        }

        if(!passwordMatch){
            return res.status(401).json({success:false, message: 'Username ou Senha Incorretos'});
        }

        return res.status(200).json({success:true, message: 'Login bem-sucedido'});
    }catch(error){
        return res.status(500).json({success:false, message: 'Erro no servidor'});
    }
};

const guardarLinks = async (req, res) => {
    try {
        const { link_instagram, id_admin } = req.body;

        if (!link_instagram) {
            return res.status(400).json({ success: false, message: 'Link inválido' });
        }

        const userExistente = await adminsettings.findOne({ where: { id_admin } });

        if (userExistente) {
            await userExistente.update({ link_instagram });
            return res.status(200).json({ success: true, message: 'Link atualizado com sucesso' });
        } else {
            await adminsettings.create({ id_admin, link_instagram, mostrar_link_instagram: true });
            return res.status(201).json({ success: true, message: 'Link guardado com sucesso' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Não foi possível guardar links', error: error.message });
    }
};

export { loginAdmin, guardarLinks};