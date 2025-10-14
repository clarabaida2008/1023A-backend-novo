import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//O que é o middleware?
//Uma função que é executada antes de chegar na função final

function Auth(req: RequestAuth, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }
    const token = authHeader.split("")[1]!
    jwt.verify(token,process.env.JWT_SECRET!, (err,decoded)=>{
        if(err){
            console.log(err);
            return res.status(401).json({mensagem: "Token inválido"})
        }
        if (typeof decoded === "string" || !decoded || !("usuarioId" in decoded)) {
            return res.status(401).json({ mensagem: "Payload inválido" });
        }
        req.usuarioId = decoded.usuarioId;
        next()

    })
    console.log("Passei no middleware");
    next()
    //throw new Error("Bloqueado");
    //return res.status(401).json({ mensagem: "Não autorizado" });
}

export default Auth