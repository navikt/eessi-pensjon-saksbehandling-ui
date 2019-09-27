import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import * as uiActions from 'actions/ui'

describe('actions/ui', () => {
  it('changeLanguage()', () => {
    i18n.changeLanguage = jest.fn()
    const mockLanguage = 'zz'
    const generatedResult = uiActions.changeLanguage(mockLanguage)
    expect(i18n.changeLanguage).toBeCalledWith(mockLanguage)
    expect(generatedResult).toMatchObject({
      type: types.UI_LANGUAGE_CHANGED,
      payload: mockLanguage
    })
  })

  it('openModal()', () => {
    const mockModal = { foo: 'bar' }
    const generatedResult = uiActions.openModal(mockModal)
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_OPEN,
      payload: mockModal
    })
  })

  it('closeModal()', () => {
    const generatedResult = uiActions.closeModal()
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_CLOSE
    })
  })

  it('toggleFooterOpen()', () => {
    const generatedResult = uiActions.toggleFooterOpen()
    expect(generatedResult).toMatchObject({
      type: types.UI_FOOTER_TOGGLE_OPEN
    })
  })

  it('toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })
})
