import amplitude from 'amplitude-js'

const isProduction = () => {
  const host = window?.location?.hostname || ''
  return host === 'pensjon-utland.intern.nav.no'
}

const isLocalhost = () => {
  const host = window?.location?.hostname || ''
  return host === 'localhost'
}

const getApiKey = () => {
  return isProduction()
    ? '08a7c81e3634edacf0d3d71843ac80bd'
    : 'cb945dabe63616def3992c0a572e5342'
}

const debug = true

const config = {
  apiEndpoint: 'amplitude.nav.no/collect',
  saveEvents: true,
  includeUtm: false,
  includeReferrer: true,
  trackingOptions: {
    city: false,
    ip_address: false,
    region: false
  }
}

export const init = () => {
  if (!isLocalhost()) {
    amplitude.getInstance().init(getApiKey(), undefined, config)
  }
}

export type AmplitudeLogger = (name: string, values?: object) => void;

export const amplitudeLogger = (name: string, values?: object) => {
  const data = values || {}
  const key = `#app.${name}`
  if (debug) {
    console.log('Amplitude:', key, data)
  }
  if (!isLocalhost()) {
    amplitude.getInstance().logEvent(key, data)
  }
}
