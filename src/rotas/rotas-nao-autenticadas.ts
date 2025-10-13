import carrinhoController from "../carrinho/carrinho.controller.js";
import produtoController from "../produtos/produto.controller.js";
import usuarioController from "../usuarios/usuario.controller.js";
import { Request, Router, Response, NextFunction } from "express";  

const rotasNaoAutenticadas = Router();

//Criando rotas para os usuários
rotasNaoAutenticadas.post("/usuarios", usuarioController.login)

export default rotasNaoAutenticadas;