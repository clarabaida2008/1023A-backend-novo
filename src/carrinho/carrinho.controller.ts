import { Request, Response } from 'express';
import { db } from "../database/banco-mongo.js";

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
    async adicionarItem(req: Request, res: Response) {
        const { produtoId, quantidade, precoUnitario, nome, usuarioId } = req.body;
        const carrinhos = db.collection('carrinho');

        // 1. Verificar se um carrinho com esse usuário já existe
        let carrinho = await carrinhos.findOne({ usuarioId });

        // 2. Se não existir criar um novo carrinho
        if (!carrinho) {
            let carrinho = {
                usuarioId,
                itens: [],
                dataAtualizacao: new Date(),
                total: 0
            };
        }
        else {

            // 3. Adicionar o item ao carrinho existente
            carrinho.itens.push({ produtoId, quantidade, precoUnitario, nome });

            // 4. Calcular o total do carrinho
            carrinho.total = carrinho.itens.reducecarrinho.total = carrinho.itens.reduce(
                (acc: number, item: ItemCarrinho) => acc + item.quantidade * item.precoUnitario,0);

            // 5. Atualizar a data de atualização do carrinho
            carrinho.dataAtualizacao = new Date();

            // 6. Salvar o carrinho
            await carrinhos.updateOne(
                { usuarioId },
                {
                    $set: {
                        itens: carrinho.itens,
                        dataAtualizacao: carrinho.dataAtualizacao,
                        total: carrinho.total
                    }
                },
                { upsert: true }
            );

            res.status(200).json(carrinho);
        }



    }
    //adicinarItem
    //ApagarItem
    //AtualizarQuantidade
    //Listar
    //Apagar Carrinho
    //Um carrinho para cada usuário, um tipo de poduto por carrinho ()
}

export default new CarrinhoController();