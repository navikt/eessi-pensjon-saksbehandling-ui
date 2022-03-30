
const {jwtVerify, createRemoteJWKSet} = require("jose");

let _issuer;
let _remoteJWKSet

async function validerToken(token) {
  return jwtVerify(token, await jwks(), {
    issuer: (await issuer()).metadata.issuer,
  });
}

async function jwks() {
  if (typeof _remoteJWKSet === "undefined") {
    _remoteJWKSet = createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI));
  }

  return _remoteJWKSet;
}

async function issuer() {
  if (typeof _issuer === "undefined") {
    if (!process.env.AZURE_APP_WELL_KNOWN_URL)
      throw new Error(`Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være satt`);
    _issuer = await Issuer.discover(process.env.AZURE_APP_WELL_KNOWN_URL);
  }
  return _issuer;
}

module.exports = {
  validerToken
}
