import * as Sentry from '@sentry/browser'

export const init = () => {
  Sentry.init({
    dsn: 'https://d146efc542844eec915ff554fb021498@sentry.gc.nav.no/28',
    environment: window.location.hostname
  })
}
