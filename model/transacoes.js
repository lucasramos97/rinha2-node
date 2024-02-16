const knex = require("../config/db").knex;
const bookshelf = require("bookshelf")(knex);

const Transacoes = bookshelf.model("Transacoes", {
  tableName: "transacoes",
});

module.exports = Transacoes;
