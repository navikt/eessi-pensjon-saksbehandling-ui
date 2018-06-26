const BASE_URL = {
  'development': 'http://localhost:3000',
  'production': 'http://localhost:80'
};

export const CASE_URL       = BASE_URL[process.env.NODE_ENV] + '/case';
export const MOTTAGER_URL   = BASE_URL[process.env.NODE_ENV] + '/mottager';
export const BUC_URL        = BASE_URL[process.env.NODE_ENV] + '/buc';
export const SED_URL        = BASE_URL[process.env.NODE_ENV] + '/sed';
export const CASESUBMIT_URL = BASE_URL[process.env.NODE_ENV] + '/casesubmit';
