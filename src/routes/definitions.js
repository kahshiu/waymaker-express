const vars = require("@src/vars");

/**
 * @param {express.Router} router 
 */
const registerRoutes = (router) => {

  router.get("/definitions/my_states", async (req, res) => {
    const states = vars.MY_STATES;
    res.json({status: "success", states});
  })
}

module.exports = { 
  registerRoutes 
}