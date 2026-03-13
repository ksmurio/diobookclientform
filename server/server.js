import { conectarDB } from './config/db.js';
import routes from './routes/index.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use('/api', routes);

const startServer = async () => {
    try {
        await conectarDB();
        console.log("Database conectada com sucesso");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.log("error ao iniciar servidor", error);
        process.exit(1);
    }
};

startServer();