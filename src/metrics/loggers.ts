import { amplitudeLogger } from './amplitude-utils'

export const linkLogger = (event: any) => {
  const name = `${event.target.dataset.amplitude}.link.clicked`
  const url = event.target.href
  amplitudeLogger(name, { url })
}

export const clickLogger = (event: any) => {
  const name = `${event.target.dataset.amplitude}.clicked`
  amplitudeLogger(name)
}

export const standardLogger = (name: string, values?: object) => {
  const data = values || {}
  amplitudeLogger(name, data)
}
