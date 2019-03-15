import * as types from '../constants/actionTypes'
import * as uiActions from './ui'
import i18n from '../i18n'

describe('ui actions', () => {
  it('call changeLanguage()', () => {
    i18n.changeLanguage = jest.fn()
    const mockLanguage = 'zz'
    const generatedResult = uiActions.changeLanguage(mockLanguage)
    expect(i18n.changeLanguage).toBeCalledWith(mockLanguage)
    expect(generatedResult).toMatchObject({
      type: types.UI_LANGUAGE_CHANGED,
      payload: mockLanguage
    })
  })

  it('call openModal()', () => {
    const mockModal = { foo: 'bar' }
    const generatedResult = uiActions.openModal(mockModal)
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_OPEN,
      payload: mockModal
    })
  })

  it('call closeModal()', () => {
    const generatedResult = uiActions.closeModal()
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_CLOSE
    })
  })

  it('call toggleDrawerOpen()', () => {
    const generatedResult = uiActions.toggleDrawerOpen()
    expect(generatedResult).toMatchObject({
      type: types.UI_DRAWER_TOGGLE_OPEN
    })
  })

  it('call toggleFooterOpen()', () => {
    const generatedResult = uiActions.toggleFooterOpen()
    expect(generatedResult).toMatchObject({
      type: types.UI_FOOTER_TOGGLE_OPEN
    })
  })

  it('call toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })

  it('call toggleDrawerEnable()', () => {
    const generatedResult = uiActions.toggleDrawerEnable()
    expect(generatedResult).toMatchObject({
      type: types.UI_DRAWER_TOGGLE_ENABLE
    })
  })

  it('call changeDrawerWidth()', () => {
    const mockWidth = 999
    const generatedResult = uiActions.changeDrawerWidth(mockWidth)
    expect(generatedResult).toMatchObject({
      type: types.UI_DRAWER_WIDTH_SET,
      payload: mockWidth
    })
  })
})
