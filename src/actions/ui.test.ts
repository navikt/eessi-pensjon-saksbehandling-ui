import * as types from 'src/constants/actionTypes'
import * as uiActions from 'src/actions/ui'
import { ModalContent } from 'src/declarations/components'
import { AllowedLocaleString } from 'src/declarations/app.d'
import i18n from 'src/i18n'
jest.mock('src/i18n', () => ({
  changeLanguage: jest.fn()
}))

describe('actions/ui', () => {
  it('changeLanguage()', () => {
    const mockLanguage = 'en' as AllowedLocaleString
    const generatedResult = uiActions.changeLanguage(mockLanguage)
    expect(i18n.changeLanguage).toHaveBeenCalledWith(mockLanguage)
    expect(generatedResult).toMatchObject({
      type: types.UI_LANGUAGE_CHANGED,
      payload: mockLanguage
    })
  })

  it('closeModal()', () => {
    const generatedResult = uiActions.closeModal()
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_SET,
      payload: undefined
    })
  })

  it('openModal()', () => {
    const mockModal = {
      modalTitle: 'title'
    } as ModalContent
    const generatedResult = uiActions.openModal(mockModal)
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_SET,
      payload: mockModal
    })
  })

  it('setWidthSize()', () => {
    const mockWidthSize = '123'
    const generatedResult = uiActions.setWidthSize(mockWidthSize)
    expect(generatedResult).toMatchObject({
      type: types.UI_WIDTH_SET,
      payload: mockWidthSize
    })
  })

  it('toggleFooterOpen()', () => {
    const generatedResult = uiActions.toggleFooterOpen()
    expect(generatedResult).toMatchObject({
      type: types.UI_FOOTER_TOGGLE_OPEN
    })
  })

})
