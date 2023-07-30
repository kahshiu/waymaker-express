const {
  registerAdminCreds, 
  verifyAdminCreds, 
  refreshAdminCreds, 
  verifyAndRefreshAdminCreds
} = require("./authMailService");

/**
 * @param {express.Router} router 
 */
const registerRoutes = (router) => {

  router.get("/google/registerAdmin", async (req, res) => {
    const code = req.query.code;
    const {action, creds} = await registerAdminCreds(code);
    res.json({status: action, creds});
  })

  router.post("/google/verifyAdmin", async (req, res) => {
    const {action, creds} = await verifyAdminCreds(code);
    res.json({status: action, creds});
  })

  router.post("/google/refreshAdmin", async (req, res) => {
    const {action, creds} = await refreshAdminCreds();
    res.json({status: action, creds});
  })

  router.post("/google/verifyAndRefreshAdmin", async (req, res) => {
    const {action, creds} = await verifyAndRefreshAdminCreds();
    res.json({status: action, creds});
  })
}

module.exports = { 
  registerRoutes 
}