/* Importando variáveis de ambiente */
require("dotenv").config();

const express = require("express");
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const router = require("./routes/routes");

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Swagger
if (process.env.server_mode == "dev") {
  const swaggerYAML = yaml.load("./docs/swagger.yaml");
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerYAML));
}

// Usando Rotas
app.use("/", router);

/* Iniciando Server */
const port = process.env.port || 8989;
app.listen(port, (erro) => {
  if (process.env.server_mode == "dev") {
    if (erro) console.log("Erro ao iniciar o servidor!");
    else {
      console.log(`Development server running in port: ${port}`);
    }
  } else {
    if (erro) console.log("Erro ao iniciar o servidor!");
    else {
      console.log(`Server running in port: ${port}`);
    }
  }
});

module.exports = app;
