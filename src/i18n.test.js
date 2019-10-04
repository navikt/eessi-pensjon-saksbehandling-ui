import i18n from './i18n'

describe('i18n', () => {
  it('initializes', () => {
    expect(i18n.options.lng).toEqual('nb')
    expect(i18n.options.fallbackLng.default).toEqual(['nb'])
    expect(i18n.options.debug).toBeFalsy()
    expect(i18n.options.ns).toEqual(['ui', 'pinfo', 'buc'])
    expect(i18n.options.defaultNS).toEqual('ui')
    expect(i18n.options.backend.loadPath).toEqual('/locales/{{lng}}/{{ns}}.json')
    expect(i18n.options.interpolation.escapeValue).toBeFalsy()
    expect(i18n.options.react.wait).toBeTruthy()
    expect(i18n.options.react.withRef).toBeTruthy()
    expect(i18n.options.react.bindI18n).toEqual('languageChange loaded')
    expect(i18n.options.react.bindStore).toEqual('added removed')
    expect(i18n.options.react.nsMode).toEqual('default')
    expect(i18n.locale).toEqual('nb')
    expect(i18n.language).toEqual('nb')
  })
})
