import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

export const conectarDB = async () =>{
    try{
        await sequelize.authenticate();
        console.log('Conecção com a database estabelecida com sucesso');
    } catch (error){
        console.error('Erro ao conectar com a database:',error);
        process.exit(1);
    }
};

export default conectarDB ;