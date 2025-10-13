import carrinhoController from "../carrinho/carrinho.controller.js";
import produtoController from "../produtos/produto.controller.js";
import usuarioController from "../usuarios/usuario.controller.js";
import { Request, Router, Response, NextFunction } from "express";  

const rotasAutenticadas = Router();

//Criando rotasAutenticadas para os usuários
rotasAutenticadas.get('/usuarios', usuarioController.listar);

rotasAutenticadas.post('/produtos', produtoController.adicionar);
rotasAutenticadas.post('/atualizarQuantidade', carrinhoController.atualizarQuantidade);

rotasAutenticadas.post('/adicionarItem', carrinhoController.adicionarItem);
rotasAutenticadas.post('/removerItem', carrinhoController.removerItem);
rotasAutenticadas.post('/atualizarQuantidade', carrinhoController.atualizarQuantidade);
rotasAutenticadas.get('/listar', carrinhoController.listar);
rotasAutenticadas.post('/apagarCarrinho', carrinhoController.apagarCarrinho);

export default rotasAutenticadas;