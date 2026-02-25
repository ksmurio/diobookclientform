import waitinglist from '../models/waitinglist.js';
import typeevents from  '../models/typeevents.js';

const adicionarReserva = async (req, res) => {
  const { nomeCliente, emailCliente, contribuinteCliente, moradaCliente, especialidade, seguro, data } = req.body;

  if(!nomeCliente || !emailCliente || !contribuinteCliente || !moradaCliente || !especialidade || !data ){
    return res.status(400).json({success: false, message: 'Preencha todos os campos'});
  }

  try{
    const novaReserva = await waitinglist.create({nomeCliente, emailCliente, contribuinteCliente, moradaCliente, especialidade, seguro, dataMarcacao: data});
    res.status(201).json({success:true, message: 'Reserva criada com sucesso', waitinglist: novaReserva});
  }catch(error){
    console.error(error);
    res.status(500).json({success: false, message: 'Verifique os inputs'});
  }
};

const listarEspecialidades = async (req, res) =>{
  try{
    const especialidades = await typeevents.findAll({where: {in_event: 1}});
    return res.status(201).json({success: true, message: 'Todas as especialidades listadas', data: especialidades});
  }catch(error){
    return res.status(500).json({success:false, message:'não foi possivel listar todas as especialidades', error: error.message});
  }
};

export {  adicionarReserva, listarEspecialidades }