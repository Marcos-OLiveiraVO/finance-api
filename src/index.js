const express = require("express");
const app = express();
const PORT = 3000;
const { v4: uuidv4 } = require("uuid");

app.listen(PORT, () => console.log("Server is running..."));
app.use(express.json());

const costumers = [];

function verifyIfAccountCpfExist(req, res, next) {
  const { cpf } = req.headers;

  const costumer = costumers.find((costumer) => costumer.cpf === cpf);

  if (!costumer) {
    return res.status(400).send({ Error: "Costumer not found." });
  }

  req.costumer = costumer;

  return next();
}

app.post("/account", (req, res) => {
  const { name, cpf } = req.body;

  const costumerAlreadyExist = costumers.some(
    (costumer) => costumer.cpf === cpf
  );

  if (costumerAlreadyExist) {
    return res.status(400).send({ Error: "Costumer already exist " });
  }

  costumers.push({
    name,
    cpf,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send(costumers);
});

app.get("/statement", verifyIfAccountCpfExist, (req, res) => {
  const { costumer } = req;
  return res.send(costumer.statement);
});
