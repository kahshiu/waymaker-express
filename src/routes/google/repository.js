const { google } = require("googleapis");
const fetch = require("node-fetch");
const {
  SUCCESS,
  ERROR_GOOGLE,
  ERROR_TOKEN,
  ERROR_UNHANDLED
} = require("@src/error");

// --------------------------
// SECTION: config dto/ model
// --------------------------

/**
 * dto google config
 * @typedef {Object} ConfigDto
 * @property {string} clientId 
 * @property {string} projectId
 * @property {string} authUri 
 * @property {string} tokenUri 
 * @property {string} clientSecret 
 * @property {string} redirectUris
 */

/**
 * model google config
 * @typedef {Object} ConfigModel 
 * @property {string} client_id 
 * @property {string} project_id
 * @property {string} auth_uri 
 * @property {string} token_uri 
 * @property {string} client_secret 
 * @property {string} redirect_uris
 */

/**
 * mapping config model to dto 
 * @param {ConfigModel} model 
 * @returns {ConfigDto}
 */
const configToDto = (model) => ({
  clientId: model.client_id,
  projectId: model.project_id,
  authUri: model.auth_uri,
  tokenUri: model.token_uri,
  certUrl: model.auth_provider_x509_cert_url,
  clientSecret: model.client_secret,
  redirectUris: model.redirect_uris,
})

const dtoToConfig = (dto) => ({
  client_id: dto.clientId,
  project_id: dto.projectId,
  auth_uri: dto.authUri,
  token_uri: dto.tokenUri,
  auth_provider_x509_cert_url: dto.certUrl,
  client_secret: dto.clientSecret,
  redirect_uris: dto.redirectUris,
})


// --------------------------
// SECTION: creds dto/ model
// --------------------------

/**
 * dto google creds
 * @typedef {Object} CredsDto 
 * @property {string} idToken
 * @property {string} accessToken
 * @property {string} refreshToken 
 * @property {number} expiresIn
 * @property {string} tokenType 
 * @property {string} scope
 */

/**
 * model google creds
 * @typedef {Object} CredsModel 
 * @property {(string | null)} id_token
 * @property {(string | null)} access_token
 * @property {(string | null)} refresh_token 
 * @property {(number | null)} expires_in
 * @property {(string | null)} token_type 
 * @property {(string | null)} scope
 */

/**
 * mapping creds model to dto
 * @param {CredsModel} model 
 * @returns {CredsDto} 
 */
const credsToDto = (model) => ({
  idToken: model.id_token ?? "",
  accessToken: model.access_token ?? "",
  refreshToken: model.refresh_token ?? "",
  expiresIn: model.expires_in ?? 0,
  tokenType: model.token_type ?? "",
  scope: model.scope ?? ""
})

/**
 * mapping creds dto to model 
 * @param {CredsDto}  dto
 * @returns {CredsModel} 
 */
const dtoToCreds = (dto) => ({
  id_token: dto.idToken ?? null,
  access_token: dto.accessToken ?? null,
  refresh_token: dto.refreshToken ?? null,
  expires_in: dto.expiresIn ?? null,
  token_type: dto.tokenType ?? null,
  scope: dto.scope ?? null,
})

const isValidCreds = (json) => 
  json.idToken &&
  json.accesToken &&
  json.refreshToken &&
  json.expiresIn &&
  json.tokenType &&
  json.scope;


// --------------------------
// SECTION: calls to google api
// ensure params enter/ exit as model
// --------------------------
const GOOGLE_AUTH_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://oauth2.googleapis.com/oauth2/v1/userInfo";

const registerCreds = async (configCurr, code) => {
  try {
    const resp = await fetch(GOOGLE_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: configCurr.client_id,
        client_secret: configCurr.client_secret,
        redirect_uri: configCurr.redirect_uris[0],
        code,
        grant_type: "authorization_code",
      }),
    });

    if (resp.status !== 200) return { action: ERROR_GOOGLE, creds: null }
    return { action: SUCCESS, creds: resp.body }

  } catch (error) {
    return {action: ERROR_UNHANDLED, creds: null};
  }
}


/**
 * use id_token to check validity
 * @param {ConfigDto} configCurr 
 * @param {CredsDto} credsCurr 
 */
const verifyCreds = async (configCurr, credsCurr) => {
  const clientId = configCurr.clientId;
  const clientSecret = configCurr.clientSecret;
  const redirectUri = configCurr.redirectUris;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  ); 

  try {
    const resp = await oAuth2Client.getTokenInfo(credsCurr.accessToken);
    const isValidResp = resp.email && resp.email_verified;
    if(!isValidResp) return { action: ERROR_TOKEN, details: null };

    return {
      action: SUCCESS,
      details: {
        email: resp.email,
        emailVerified: resp.email_verified,
        accessType: resp.access_type,
        expiryDate: resp.user_id,
      }
    }

  } catch(err) {
    log.error("verifyToken, unhandled: ", err);
    return {action: ERROR_UNHANDLED, details: null};
  }

}

/**
 * use refresh token to retrieve id token in 
 * 
 * @param {ConfigDto} configCurr
 * @param {CredsDto} credsCurr
 * 
 * @returns 
 */
const refreshCreds = async (configCurr, credsCurr) => {
  try {
    const resp = await fetch(GOOGLE_AUTH_URL, {
      method: "POST", 
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: configCurr.clientId,
        client_secret: configCurr.clientSecret,
        refresh_token: credsCurr.refreshToken,
        grant_type: "refresh_token",
      })
    })
    if(resp.status !== 200) return {action: ERROR_GOOGLE, creds: null}

    const credsResp = credsToDto(resp.body);
    const credsNew = {
      idToken: credsResp.idToken ?? credsCurr.idToken,
      accessToken: credsResp.accessToken ?? credsCurr.accessToken,
      refreshToken: credsResp.refreshToken ?? credsCurr.refreshToken,
      expiresIn: credsResp.expiresIn ?? credsCurr.expiresIn,
      tokenType: credsResp.tokenType ?? credsCurr.tokenType,
      scope: credsResp.scope ?? credsCurr.scope,
    }
    if(!isValidCreds(credsNew)) return {action: ERROR_TOKEN, creds: null}
    return {action: SUCCESS, creds: credsNew};

  } catch (err) {
    log.error("refreshCreds, unhandled: ", err)
    return {action: ERROR_UNHANDLED, creds: null};
  }
}

/**
 * use refresh token to retrieve id token in 
 * 
 * @param {ConfigDto} configCurr
 * @param {CredsDto} credsCurr
 * 
 * @returns 
 */
const getUserInfo = async (configCurr, credsCurr) => {
  const headerObj = {
    Authorization: `Bearer ${credsCurr.idToken}`
  }
  const qsObj = new URLSearchParams({
    alt: "json",
    access_token: credsCurr.accessToken,
  });
  const url = `${GOOGLE_USERINFO_URL}?${qsObj.toString()}`;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: headerObj,
    });
    if (resp.status !== 200) return {action: ERROR_GOOGLE, userInfo: null};
    const result = resp.body;
    return {action: SUCCESS, userInfo: result};

  } catch (err) {
    log.error("getUserInfo, unhandled: ", err)
    return {action: ERROR_UNHANDLED, userInfo: null};
  }
}

module.exports = {
  configToDto,
  dtoToConfig,
  dtoToCreds,
  credsToDto,

  registerCreds,
  verifyCreds,
  refreshCreds,
  getUserInfo
}