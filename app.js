/* Importando variáveis de ambiente */
require("dotenv").config();

const express = require("express");
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const router = require("./routes/routes");

const app = express();

//Cors
app.use(cors());

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
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, (erro) => {
  if (process.env.server_mode == "dev") {
    if (erro) console.log("Erro ao iniciar o servidor!");
    else {
      console.log(`Development server running in port: ${PORT}`);

      console.log(process.env);
    }
  } else {
    if (erro) console.log("Erro ao iniciar o servidor!");
    else {
      console.log(`Server running in port: ${PORT}`);
    }
  }
});

module.exports = app;
