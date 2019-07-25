import React from 'react'
import { Modal } from './Modal'

describe('components/Modal', () => {

  const initialMockProps = {
    actions: {
      closeModal: jest.fn()
    },
    modal: {
      modalTitle: 'mockModalTitle',
      modalText: 'mockModalText',
      modalButtons: [{
        main: true,
        text: 'modalMainButtonText',
        onClick: jest.fn()
      }, {
        text: 'modalOtherButtonText',
        onClick: jest.fn()
      }]
    },
    modalOpen: true
  }

  it('Renders', () => {
    let wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    let wrapper = mount(<Modal {...initialMockProps} />)
    expect(wrapper.find('.c-modal__title').hostNodes().render().text()).toEqual(initialMockProps.modal.modalTitle)
    expect(wrapper.find('.c-modal__text').hostNodes().render().text()).toEqual(initialMockProps.modal.modalText)
    expect(wrapper.find('#c-modal__main-button-id').hostNodes().render().text()).toEqual(initialMockProps.modal.modalButtons[0].text)
    expect(wrapper.find('#c-modal__other-button-id').hostNodes().render().text()).toEqual(initialMockProps.modal.modalButtons[1].text)
  })

  it('Buttons are active', () => {
    let wrapper = mount(<Modal {...initialMockProps} />)
    wrapper.find('#c-modal__main-button-id').hostNodes().simulate('click')
    expect(initialMockProps.modal.modalButtons[0].onClick).toHaveBeenCalled()

    wrapper.find('#c-modal__other-button-id').hostNodes().simulate('click')
    expect(initialMockProps.modal.modalButtons[1].onClick).toHaveBeenCalled()
  })
})
