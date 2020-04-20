import amplitude from 'amplitude-js'

const url = window && window.location && window.location.href
  ? window.location.href
  : ''

export const erProduksjon = () => {
  return url.indexOf('www.nav.no') > -1
}

const getApiKey = () => {
  return erProduksjon()
    ? 'produsjon-apikey'
    : 'dev-apikey'
}

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
}

amplitude.getInstance().init(getApiKey(), undefined, config)

export type AmplitudeLogger = (name: string, values?: object) => void;

export function amplitudeLogger (name: string, values?: object) {
  const data = values || {}
  const key = `eessipensjon.ui.fss.${name}`
  amplitude.logEvent(key, data)
}
