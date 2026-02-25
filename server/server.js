import { conectarDB } from './config/db.js';
import routes from './routes/index.js'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.json());

const startServer = async () => {
  try{
    await conectarDB();
    console.log("Database conectada com sucesso");

    const PORT = process.env.PORT || 3000;;
    app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); 
    });
  }catch(error){
    console.log("error ao iniciar servidor", error);
    process.exit(1);
  }
}

startServer();