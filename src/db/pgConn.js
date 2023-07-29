const { Pool } = require("pg")
const conn = {
  host: "localhost",
  port : 8010,
  database : "hecker_db",
  user: "sy123",
  password: "0126221766",
}


// SECTION: pool listeners
const pool = new Pool({...conn, poolSize: 20});
pool.on("release", (err, client) => {
  console.log("db pool, released")
})
pool.on("error", (err, client) => {
  console.log("db pool, errored")
  console.log(error)
  process.exit(-1)
})


module.exports = {
  pool
}