import { Request, Response } from "express";
import { ObjectId } from "bson";
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

interface Produto {
    _id: ObjectId;
    nome: string,
    preco: number,
    descricao: string,
    urlfoto: string
}

class CarrinhoController {
    //Função para adicionar item ao carrinho
    async adicionarItem(req: Request, res: Response) {
        const { usuarioId, produtoId, quantidade } = req.body as { usuarioId: string, produtoId: string, quantidade: number };
        console.log(usuarioId, produtoId, quantidade)
        //Poderia fazer uma validação dos dados enviados

        //Buscar produto pra ver se ele existe no banco de dados, também pegar o nome e o preço do produto
        const produto = await db.collection<Produto>('produtos')
            .findOne({ _id: ObjectId.createFromHexString(produtoId) });
        if (!produto)
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        const nome = produto.nome;
        const precoUnitario = produto.preco;

        //Verificar se o carrinho já existe no banco
        const carrinho = await db.collection("carrinho").findOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });

        if (!carrinho) {
            const carrinhoNovo: Carrinho = {
                usuarioId: usuarioId,
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
            const resposta = await db.collection<Carrinho>("carrinho").insertOne(carrinhoNovo);
            //Early Return
            return res.status(201).json({ ...carrinhoNovo, _id: resposta.insertedId })
        }

        //Verificar se o produto já existe no carrinho
        const item = carrinho.itens.find((item: ItemCarrinho) => item.produtoId === produtoId);

        //FIND: devolve o item
        //FIND.INDEX: devolve a posição do item no vetor
        //FILTER: devolve um vetor com os itens que satisfazem a condição
        //PUSH: adiciona um item no vetor
        //$SET: atualiza um campo do documento

        if (item) {
            item.quantidade += quantidade;
            carrinho.total += precoUnitario * quantidade;
            carrinho.dataAtualizacao = new Date();
        } else {
            carrinho.itens.push({
                produtoId: produtoId,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                nome: nome
            });
            carrinho.total += precoUnitario * quantidade;
            carrinho.dataAtualizacao = new Date();
        }
        // Atualizar o carrinho no banco de dados
        await db.collection<Carrinho>("carrinhos").updateOne({ usuarioId: usuarioId },
            {
                $set: {
                    itens: carrinho.itens,
                    total: carrinho.total,
                    dataAtualizacao: carrinho.dataAtualizacao
                }
            }
        )
        res.status(200).json(carrinho);
    }

    async removerItem(req: Request, res: Response) {
        const { usuarioId, produtoId } = req.body;

        // Buscar o carrinho do usuário
        const carrinho = await db.collection("carrinho").findOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        // Encontrar o item no carrinho
        const itemIndex = carrinho.itens.findIndex((item: ItemCarrinho) => item.produtoId === produtoId);
        if (itemIndex === -1) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }

        // Atualizar total do carrinho
        const itemRemovido = carrinho.itens[itemIndex];
        carrinho.total -= itemRemovido.precoUnitario * itemRemovido.quantidade;

        // Remover o item do vetor
        carrinho.itens.splice(itemIndex, 1);
        carrinho.dataAtualizacao = new Date();

        // Atualizar o carrinho no banco
        await db.collection("carrinho").updateOne(
            { usuarioId: ObjectId.createFromHexString(usuarioId) },
            {
                $set: {
                    itens: carrinho.itens,
                    total: carrinho.total,
                    dataAtualizacao: carrinho.dataAtualizacao
                }
            }
        );

        res.status(200).json({ mensagem: "Item removido do carrinho"});
    }

    async atualizarQuantidade(req: Request, res: Response) {
        const { usuarioId, produtoId, quantidade } = req.body;

        // Buscar o carrinho do usuário
        const carrinho = await db.collection("carrinho").findOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        // Encontrar o item no carrinho
        const item = carrinho.itens.find((item: ItemCarrinho) => item.produtoId === produtoId);
        if (!item) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }

        // Atualizar a quantidade
        item.quantidade = quantidade;

        // Recalcular o total do carrinho
        carrinho.total = carrinho.itens.reduce((acc: number, curr: ItemCarrinho) => acc + curr.precoUnitario * curr.quantidade, 0);
        carrinho.dataAtualizacao = new Date();

        // Atualizar o carrinho no banco
        await db.collection("carrinho").updateOne(
            { usuarioId: ObjectId.createFromHexString(usuarioId) },
            {
                $set: {
                    itens: carrinho.itens,
                    total: carrinho.total,
                    dataAtualizacao: carrinho.dataAtualizacao
                }
            }
        );

        res.status(200).json({ mensagem: "Quantidade atualizada", carrinho });
    }

    async listar(req: Request, res: Response) {
        const { usuarioId } = req.body;

        // Buscar o carrinho do usuário
        const carrinho = await db.collection("carrinho").findOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        res.status(200).json(carrinho);
    }

    async apagarCarrinho(req: Request, res: Response) {
        const { usuarioId } = req.body;

        const resultado = await db.collection("carrinho").deleteOne({ usuarioId: ObjectId.createFromHexString(usuarioId) });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        res.status(200).json({ mensagem: "Carrinho apagado com sucesso" });
    }
}


export default new CarrinhoController();