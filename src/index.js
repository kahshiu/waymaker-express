require('module-alias/register');
const express = require("express");
const multer = require("multer");

const vars = require("./vars");
const log = require("@src/logger");
const middlewares = require("./middlewares");
const diagnostics = require("./routes/diagnostics");
const definitions = require("./routes/definitions");
const entities = require("./routes/entities");
const google = require("./routes/google/controller");
const templates = require("./routes/templates");

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(middlewares.checkDb);

const router = express.Router();
diagnostics.registerRoutes(router);
definitions.registerRoutes(router);
entities.registerRoutes(router);
google.registerRoutes(router);
templates.registerRoutes(router);

server.get("/", (req, resp)=>{
  const { test } = req.query
});

server.use("/api", router);

server.listen(vars.PORT_NO, () => {
  log.info(`${vars.APP_NAME} actively listen on port ${vars.PORT_NO}`);
});
