import { CountryData } from 'eessi-pensjon-ui'

export const getBucTypeLabel = ({ type, locale, t }) => {
  if (!type.match('P3000_')) {
    return t('buc:buc-' + type)
  }
  const country = type.match(/_(.*)$/)[1]
  const countryLabel = CountryData.findByValue(locale, country)
  return t('buc:buc-P3000_XX', { country: countryLabel.label })
}

// the higher the indexOf, the higher it goes in the sorted list
const sedTypes = ['X', 'H', 'P']

export const sedSorter = (a, b) => {
  if (b.lastUpdate - a.lastUpdate > 0) return 1
  if (b.lastUpdate - a.lastUpdate < 0) return -1
  const mainCompare = parseInt(a.type.replace(/[^\d]/g, ''), 10) - parseInt(b.replace.type(/[^\d]/g, ''), 10)
  const sedTypeA = a.type.charAt(0)
  const sedTypeB = b.type.charAt(0)
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
  return mainCompare
}
