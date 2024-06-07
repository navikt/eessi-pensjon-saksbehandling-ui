const fs = require('fs');
const path = require('path');

console.log("Start of Migratefile")

const oldEnvVars = [
  'AZURE_APP_CLIENT_ID',
  'AZURE_APP_CLIENT_SECRET',
  'AZURE_OPENID_CONFIG_TOKEN_ENDPOINT',
  'AZURE_OPENID_CONFIG_JWKS_URI',
  'AZURE_APP_WELL_KNOWN_URL'
/*
  'NAV_TRUSTSTORE_KEYSTOREALIAS',
  'EESSI_PENSJON_WEBSOCKETURL'
  'EESSI_PENSJON_FRONTEND_API_URL',
  'EESSI_PENSJON_FAGMODUL_URL',
  'EESSI_PENSJON_FRONTEND_API_TOKEN_SCOPE',
  'EESSI_PENSJON_FAGMODUL_TOKEN_SCOPE',
  'PUBLIC_WEBSOCKETURL',
  'NAV_DEKORATOREN_URL',
  'ZONE',
  'EESSI_PENSJON_FRONTEND_API_FSS_URL',
*/
];

const newEnvVars = oldEnvVars.map((oldEnvVarName) => {
  const viteVarName = `VITE_${oldEnvVarName}`;
  const value = process.env[oldEnvVarName];
  console.log("oldEnvVarName" + oldEnvVarName)
  if (value === undefined) {
    throw new Error(`Environment variable ${oldEnvVarName} is not set`);
  }
  return `${viteVarName}=${value}`;
}).join('\n');

fs.writeFileSync(path.join(__dirname, '.env'), newEnvVars);

console.log('Vite environment variables created');
