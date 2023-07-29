const log = require("@src/logger");
const { pool } = require("@db/pgConn");
const { getVersion } = require("@db/query/common");

const connection = {
  isOk: null,
  version: null,
}; 

const checkDb = async (req, resp, next) => {
  try {
    if(connection.isOk === null) {
      const client = await pool.connect(); 
      const { version } = getVersion(client);
      log.info("DB: connection est, version: ", version);

      client.release();
      connection.isOk = true; 
      connection.version = version; 
    } 

    if(connection.isOk) {
      await next();
    }

  } catch (err) {
    resp.json(
      {ERROR: "DB connection problem"}
    )
  }

}

module.exports = {
  checkDb,
}