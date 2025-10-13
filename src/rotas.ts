import carrinhoController from "./carrinho/carrinho.controller.js";
import produtoController from "./produtos/produto.controller.js";
import usuarioController from "./usuarios/usuario.controller.js";   

import { Router } from "express";
const rotas = Router();

//Criando rotas para os usuários
rotas.post('/usuarios', usuarioController.adicionar);
rotas.get('/usuarios', usuarioController.listar);

rotas.post('/produtos', produtoController.adicionar);
rotas.post('/atualizarQuantidade', carrinhoController.atualizarQuantidade);

rotas.post('/adicionarItem', carrinhoController.adicionarItem);
rotas.post('/removerItem', carrinhoController.removerItem);
rotas.post('/atualizarQuantidade', carrinhoController.atualizarQuantidade);
rotas.get('/listar', carrinhoController.listar);
rotas.post('/apagarCarrinho', carrinhoController.apagarCarrinho);

export default rotas;