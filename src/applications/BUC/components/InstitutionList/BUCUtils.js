import { CountryData } from 'eessi-pensjon-ui'

export const getBucTypeLabel = ({ type, locale, t }) => {
  if (!type.match('P3000_')) {
    return t('buc:buc-' + type)
  }
  const country = type.match(/_(.*)$/)[1]
  console.log(type, country)
  const countryLabel = CountryData.findByValue(locale, country)
  return t('buc:buc-P3000_XX', { country: countryLabel.label })
}
