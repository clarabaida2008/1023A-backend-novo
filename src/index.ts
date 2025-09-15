import "dotenv/config"
import mysql from 'mysql2/promise';
console.log(process.env.DBUSER);

import express, { Request, Response } from "express";
const app = express();

app.get("/", async (req: Request, res: Response) => {
    //! significa a negação da variável, váriável com algo: true / variável sem nada: false, mas ja que tem a negação eles invertem e quando não tem nada ela entra no if
    if (!process.env.DBUSER) {
        res.status(500).send("Variável de ambiente DBUSER não definida");
        return;
    }
    if (process.env.DBPASSWORD == undefined) {
        res.status(500).send("Variável de ambiente DBPASSWORD não definida");
        return;
    }
    if (!process.env.DBNAME) {
        res.status(500).send("Variável de ambiente DBNAME não definida");
        return;
    }
    if (!process.env.DBHOST) {
        res.status(500).send("Variável de ambiente DBHOST não definida");
        return;
    }
    if (!process.env.DBPORT) {
        res.status(500).send("Variável de ambiente DBPORT não definida");
        return;
    }
    try {
        const connection = await mysql.createConnection({
            //mesma coisa que if (process.env.DBHOST) { host: process.env.DBHOST } else { host: 'localhost' }
            //host: process.env.DBHOST?process.env.DBHOST:'localhost',
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBNAME,
            port: Number(process.env.DBPORT)
        });
        res.send("Conectado ao banco de dados com sucesso!");
        await connection.end();
    }
    catch (error) {
        res.status(500).send("Erro ao conectar com o banco de dados: " + error);
    }
    
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})