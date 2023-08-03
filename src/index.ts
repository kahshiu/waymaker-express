import 'module-alias/register';
import express from "express";
import log from "@src/logger";
import {APP_NAME, PORT_NO} from "@src/vars"

const server = express();
server.use(express.json());
server.use(express.urlencoded());

server.get("/", (req, resp) => {
  resp.json({hello: "world"});
})


server.listen(PORT_NO, () => {
  log.info(`${APP_NAME} actively listen on port ${PORT_NO}`);
});

