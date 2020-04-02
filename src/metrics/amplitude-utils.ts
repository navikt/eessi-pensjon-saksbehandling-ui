import amplitude from 'amplitude-js';

const url = window && window.location && window.location.href
    ? window.location.href
    : '';

export const erProduksjon = () => {
  return url.indexOf('www.nav.no') > -1;
}

const getApiKey = () => {
  return erProduksjon()
      ? '288ae1031f9f2dbf48a41713720f39fb'
      : '7c12e731b354053c8a6e8dec798fdb8e';
};

const config = {
  apiEndpoint: 'amplitude.nav.no/collect',
  saveEvents: true,
  includeUtm: true,
  includeReferrer: false,
  trackingOptions: {
     city: false,
     ip_address: false,
     region: false
  }
};

amplitude.getInstance().init(getApiKey(), undefined, config);

export type AmplitudeLogger = (name: string, values?: object) => void;

export function amplitudeLogger (name: string, values?: object) {
  const data = values || {};
  const key = `eessipensjon.ui.fss.${name}`;
  amplitude.logEvent(key, data);
}
