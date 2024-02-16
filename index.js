const express = require("express");
const app = express();
const Clientes = require("./model/clientes");
const Transacoes = require("./model/transacoes");

app.use(express.json());
app.post("/clientes/:id/transacoes", async (req, res) => {
  const { valor, tipo, descricao } = req.body;
  if (
    !valor ||
    valor < 1 ||
    !["c", "d"].includes(tipo) ||
    !descricao ||
    descricao.length < 1 ||
    descricao.length > 10
  ) {
    res.status(422).json();
    return;
  }
  try {
    const id = req.params.id;
    const cliente = await Clientes.where({ id }).fetch();
    const clienteObj = cliente.toJSON();
    const limite = clienteObj.limite;
    const saldo = clienteObj.saldo - valor;
    if ("d" === tipo && saldo < -1 * limite) {
      res.status(422).json();
      return;
    }
    await Clientes.forge({ id }).save({ saldo });
    await Transacoes.forge().save({
      valor,
      tipo,
      descricao,
      realizada_em: new Date(),
      cliente_id: id,
    });
    res.json({ limite, saldo });
  } catch (e) {
    res.status(404).json();
  }
});

app.get("/clientes/:id/extrato", async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await Clientes.where({ id }).fetch({
      withRelated: ["transacoes"],
      require: true,
    });
    const clienteObj = cliente.toJSON();
    const saldo = {
      total: clienteObj.saldo,
      data_extrato: new Date(),
      limite: clienteObj.limite,
    };
    const ultimas_transacoes = clienteObj.transacoes
      .map((t) => ({
        valor: t.valor,
        tipo: t.tipo,
        descricao: t.descricao,
        realizada_em: t.realizada_em,
      }))
      .sort((t1, t2) => Number(t2.realizada_em) - Number(t1.realizada_em))
      .slice(0, 10);
    res.json({
      saldo,
      ultimas_transacoes,
    });
  } catch (e) {
    res.status(404).json();
  }
});

app.listen(3000, () => console.log("Server is up and running"));
