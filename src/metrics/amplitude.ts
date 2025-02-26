import * as amplitude from "@amplitude/analytics-browser";

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

const debug = false

const config = {
  serverUrl: 'https://amplitude.nav.no/collect-auto',
  saveEvents: false,
  includeUtm: true,
  includeReferrer: true,
  defaultTracking: false,
  trackingOptions: {
    ipAddress: false
  }
}

export const init = () => {
  if (!isLocalhost()) {
    amplitude.init(getApiKey(), undefined, config)
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
    amplitude.track(key, data)
  }
}
