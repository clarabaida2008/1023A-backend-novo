import 'dotenv/config'
import express, { Request, Response } from 'express';
import rotas from './rotas';

const app = express();
app.use(express.json());
app.use(rotas);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

// id nome preco urlfoto descricao