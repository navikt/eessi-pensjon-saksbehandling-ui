import * as Sentry from '@sentry/browser'

export const init = () => {

  console.log("GIT_COMMIT_HASH: " + import.meta.env.GIT_COMMIT_HASH)
  Sentry.init({
    dsn: 'https://d146efc542844eec915ff554fb021498@sentry.gc.nav.no/28',
    release: import.meta.env.GIT_COMMIT_HASH || 'unknown',
    environment: window.location.hostname
  })
}
