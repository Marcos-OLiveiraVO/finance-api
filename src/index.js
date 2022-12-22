const express = require("express");
const app = express();
const PORT = 3000;
const { v4: uuidv4 } = require("uuid");

app.listen(PORT, () => console.log("Server is running..."));
app.use(express.json());

const costumers = [];

app.post("/account", (req, res) => {
  const { name, cpf } = req.body;
  const id = uuidv4();

  costumers.push({
    name,
    cpf,
    id,
  });

  return res.send(costumers);
});
