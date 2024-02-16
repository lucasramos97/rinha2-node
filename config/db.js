const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "mysecretpassword",
    database: "postgres",
    charset: "utf8",
  },
});

module.exports.knex = knex;
