import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import rotasAutenticadas from './rotas/rotas-autenticadas.js';
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js';


const app = express();
app.use(express.json());

//O que é o middleware?
//Uma função que é executada antes de chegar na função final

function Middleware(req: Request, res: Response, next: NextFunction) {
    //throw new Error("Bloqueado");
    return res.status(401).json({ mensagem: "Não autorizado" });
}

app.use(rotasNaoAutenticadas)
app.use(Middleware);
app.use(rotasAutenticadas);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});