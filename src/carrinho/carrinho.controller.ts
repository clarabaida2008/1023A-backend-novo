import type { Request, Response } from 'express';
import { db } from "../database/banco-mongo.js";
import { ObjectId } from 'mongodb';

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}
interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

class CarrinhoController {
    async adicionarCarrinho(req: Request, res: Response) {
        const { usuarioId, itens, dataAtualizacao, total } = req.body;
        console.log(usuarioId, itens, dataAtualizacao, total);
        res.json({ message: 'Carrinho adicionado com sucesso!' });

        //Verificar se um carrinho com o usuário já existe
        const carrinho = await db.collection('carrinhos').find({ _id: ObjectId.createFromHexString(usuarioId) }).toArray();

        if (carrinho.length === 0) {
            const data = new Date();
            const resultado = await db.collection("carrinhos").insertOne({usuarioId: usuarioId,itens: [],total: 0,dataAtualizacao: data})
        
            return res.status(201).json({_id: resultado.insertedId, usuarioId, itens: [], total: 0, dataAtualizacao: data});
        }
        return res.status(201).json(carrinho );
    }
    
    //adicionarItem
    async adicionarItem(req: Request, res: Response) {
        const { usuarioId, produtoId, quantidade, precoUnitario, nome } = req.body;
        console.log(usuarioId, produtoId, quantidade, precoUnitario, nome);
        res.json({ message: 'Item adicionado ao carrinho com sucesso!' });

        //Buscar o produto no banco de dados
        const produto = await db.collection('produtos').find({ _id: ObjectId.createFromHexString(produtoId) }).toArray();

        if (produto.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        //Verificar se um carrinho com o usuário já existe
        const carrinho = await db.collection('carrinhos').find({ _id: ObjectId.createFromHexString(usuarioId) }).toArray();

        if (carrinho.length === 0) {
            return res.status(404).json({ message: 'Carrinho não existente' });
            await this.adicionarCarrinho(req, res);
        }
    }

    //const carrinho = await db.collection

}

    //adicinarItem
    //ApagarItem
    //AtualizarQuantidade
    //Listar
    //Apagar Carrinho
    //Um carrinho para cada usuário, um tipo de poduto por carrinho ()
}

export default new CarrinhoController();