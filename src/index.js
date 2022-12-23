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
    return res.status(400).json({ error: "Customer not found!" });
  }

  // Adicionando novo parâmetro de request no middleware
  req.costumer = costumer;

  return next();
}

function getBalance(statement) {
  const balance = costumers.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
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
    id: uuidv4(),
    cpf,
    name,
    statement: [],
  });

  return res.status(201).send();
});

app.get("/account", verifyIfAccountCpfExist, (req, res) => {
  const { costumer } = req;

  return response.json(costumer);
});

app.get("/statement", verifyIfAccountCpfExist, (req, res) => {
  const { costumer } = req;
  return res.json(costumer.statement);
});

app.post("/deposit", verifyIfAccountCpfExist, (req, res) => {
  const { description, amount } = req.body;
  const { costumer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  costumer.statement.push(statementOperation);

  return res.status(201).send();
});

app.post("/withdraw", verifyIfAccountCpfExist, (req, res) => {
  const { amount } = req.body;
  const { costumer } = req;

  const balance = getBalance(costumer.statement);

  if (balance < amount) {
    return res.status(400).send({ Error: "Insufficient funds." });
  }

  const statementOperation = {
    amount,
    create_At: new Date(),
    type: "debit",
  };

  costumer.statement.push(statementOperation);

  return res.status(201).send();
});
