const vars = require("@src/vars");

/**
 * @param {express.Router} router 
 */
const registerRoutes = (router) => {

  router.get("/diagnostics/version", async (req, res) => {
    const version = vars.VERSION;
    res.json({status: "success", version});
  })

  router.get("/diagnostics/testing", async (req, res) => {
    res.json({status: "success", message: "hello world"});
  })
}

module.exports = { 
  registerRoutes 
}