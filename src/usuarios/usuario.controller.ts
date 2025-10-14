import { Request, Response } from 'express';
import { db } from "../database/banco-mongo.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        const usuario = await db.collection("usuarios").findOne({email});
        if (!usuario) {
            return res.status(400).json({mensagem: "Email ou senha inválidos"});
        }
        //Criar um tolken
        const token = jwt.sign({usuarioId:usuario._id},process.env.JWT_SECRET!,{expiresIn: '1h'});

        //Devolve o token
        res.status(200).json({token});
    }
}
export default new UsuarioController();