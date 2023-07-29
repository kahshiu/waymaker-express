const pool = require("@db/pgConn");
const { Client } = require("pg");

/**
 * @param {express.Router} router 
 */
const registerRoutes = (router) => {

  router.get("/templates", 
  
    /**
     * @param {Request} req
     * @param {Response} res
     */
    async (req, res) => {
      // ("postgres://sy123:0126221766@localhost:8010/hecker_db");



  // SECTION: static details about database
  const client = await pool.connect(); 

  const test = await getVersion(client)
  console.log(test)



      // const x = await client.query("select 1")
      client.release();
      res.json({"templates": test});
    }
  )
}




module.exports = { 
  registerRoutes 
}