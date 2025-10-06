import type { Request, Response } from 'express';
import { db } from "../database/banco-mongo.js";
import { ObjectId } from 'bson';

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
        const { usuarioId, produtoId, precoUnitario, quantidade, nome } = req.body;
        //Fazer uma validação dos dados enviados

        //Vendo se o carrinho já existe no banco
        const carrinho = await db.collection("carrinho").findOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });

        if (!carrinho) {
            const carrinhoNovo:Carrinho = {
                usuarioId:usuarioId,
                itens: [{
                    produtoId: produtoId,
                    nome: nome,
                    quantidade: quantidade,
                    precoUnitario: precoUnitario,
                }],
                total: quantidade * precoUnitario,
                dataAtualizacao: new Date()
            }

            //Salvando o carrinho novo no banco de dados
            await db.collection<Carrinho>("carrinho").insertOne(carrinhoNovo);
        } else {
            //Verificar se o produto já existe no carrinho
            const item = carrinho.itens.find((item: ItemCarrinho) => item.produtoId === produtoId);
            if (!item) {
                const itemNovo = { usuarioId, produtoId, precoUnitario, quantidade, nome };
                carrinho.itens.push(itemNovo);
                //Fazer função de atualizar a data e o valor total no carrinho --> usar todos os itens para calcular o total
                //termina com update set updateOne({usuarioId: ObjectId.createFromHexString(usuarioId)}, $set{itens, total, data})

            } else {
                item.quantidade += quantidade;
                //calcular o total e a nova data de modificação
                //termina com update set
            }
        }
    }
}
export default new CarrinhoController();