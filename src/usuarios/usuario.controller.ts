import { Request, Response } from 'express';
import { db } from "../database/banco-mongo.js";
import bcrypt from 'bcrypt';

class UsuarioController {
    async adicionar(req: Request, res: Response) {
        const { nome, idade, email, senha } = req.body;
        if (!nome || !idade || !email || !senha) {
            return res.status(400).json({ mensagem: "Dados incompletos" });
        } else {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const usuario = { nome, idade, email, senha }
            const resultado = await db.collection('usuarios')
                .insertOne(usuario)
            res.status(201).json({ ...usuario, _id: resultado.insertedId })
        }
    }
    async listar(req: Request, res: Response) {
        const usuarios = await db.collection('usuarios').find().toArray();
        res.status(200).json(usuarios);
    }
    async login(req: Request, res: Response) {
        //Recebe email e senha
        const {email, senha} = req.body
        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
        }
        //Verifica se estão corretos
        const usuário = await db.collection("usuarios").findOne({email});
        
        //Criar um tolken
        //Devolve o token
    }
}
export default new UsuarioController();