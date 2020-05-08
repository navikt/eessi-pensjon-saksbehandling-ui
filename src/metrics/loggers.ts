import { amplitudeLogger } from 'metrics/amplitude'

export const linkLogger = (event: any, values?: object) => {
  const name = `${event.target.dataset.amplitude}.link.clicked`
  const url = event.target.href
  const data = values || {}
  amplitudeLogger(name, {
    ...data,
    url : url
  })
}

export const clickLogger = (event: any, values?: object) => {
  const name = `${event.target.dataset.amplitude}.clicked`
  const data = values || {}
  amplitudeLogger(name, data)
}

export const standardLogger = (name: string, values?: object) => {
  const data = values || {}
  amplitudeLogger(name, data)
}
