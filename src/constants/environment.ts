export default import.meta.env.NODE_ENV
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development'
export const IS_PRODUCTION = import.meta.env.MODE === 'production'
export const IS_TEST = import.meta.env.MODE === 'test'
export const IS_Q = window.location.hostname.endsWith("intern.dev.nav.no")
