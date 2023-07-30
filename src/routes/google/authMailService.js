const { readJson, writeJson } = require("@src/helpers.js");
const { 
  configToDto,
  dtoToConfig,
  dtoToCreds,
  credsToDto,

  registerCreds,
  verifyCreds,
  refreshCreds,
  getUserInfo 
} = require("./repository.js");
const {
  SUCCESS,
  ERROR_TOKEN,
} = require("@src/error");

// --------------------------
// SECTION: readers and writers 
// --------------------------
const GOOGLE_CONFIG_PATH = "./client_config.json";
const GOOGLE_CREDS_PATH = "./client_creds.json";
const ERROR_FILE = "missing file";

const readAdminFiles = async () => {
  const config = await readJson(GOOGLE_CONFIG_PATH);
  const creds = await readJson(GOOGLE_CREDS_PATH);
  return {
    configCurr: config && config.web? configToDto(config.web): null, 
    credsCurr: creds? credsToDto(creds): null, 
  };
}
const writeAdminCred = async (model) => {
  return await writeJson(GOOGLE_CREDS_PATH, JSON.stringify(model, undefined, 2));
}

const registerAdminCreds = async (code) => {
  const {configCurr} = await readAdminFiles();
  if(configCurr === null) return {action: ERROR_FILE, creds: null};

  const {action, creds} = await registerCreds(configCurr, code);
  if(action !== SUCCESS) return {action, creds: null};

  await writeAdminCred(GOOGLE_CREDS_PATH, creds);
  const credsDto = credsToDto(creds);
  return { action: SUCCESS, creds: credsDto };
}

const verifyAdminCreds = async () => {
  const {configCurr, credsCurr} = await readAdminFiles();
  if (configCurr === null || credsCurr === null) return {action: ERROR_FILE, creds: null};

  const { action } = await verifyCreds(configCurr, credsCurr);

  if(action !== SUCCESS) return { action, creds: null };
  return { action: SUCCESS, creds: credsCurr }
}

const refreshAdminCreds = async () => {
  const {configCurr, credsCurr} = await readAdminFiles();
  if (configCurr === null || credsCurr === null) return {action: ERROR_FILE, creds: null};

  const { action, creds } = await refreshAdminCreds(configCurr, credsCurr);

  if(action !== SUCCESS) return { action, creds: null };

  await writeJson(GOOGLE_CREDS_PATH, creds);
  return { action: SUCCESS, creds: credsToDto(creds) }
}

const verifyAndRefreshAdminCreds = async () => {
  const verify = await verifyAdminCreds();
  if(verify.action === SUCCESS) return { action: verify.action, creds: verify.creds };
  if(verify.action === ERROR_TOKEN) {
    const refresh = await refreshAdminCreds();
    return refresh;
  }
  return verify;
}

module.exports = {
  registerAdminCreds,
  verifyAdminCreds,
  refreshAdminCreds,
  verifyAndRefreshAdminCreds,
  getUserInfo,
}
