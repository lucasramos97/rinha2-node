const knex = require("../config/db").knex;
const bookshelf = require("bookshelf")(knex);
const Transacoes = require("./transacoes");

const Clientes = bookshelf.model("Clientes", {
  tableName: "clientes",
  transacoes() {
    return this.hasMany(Transacoes);
  },
});

module.exports = Clientes;
