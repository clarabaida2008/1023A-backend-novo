use("bancoaula");

db.createCollection("estudantes");

db.estudantes.insertMany([
    {
        nome: "Nicolle",
        idade: 17,
    },
    {
        nome: "Clara",
        idade: 16,
    },
    {
        nome: "Livia",
        idade: 17,
    }
])
