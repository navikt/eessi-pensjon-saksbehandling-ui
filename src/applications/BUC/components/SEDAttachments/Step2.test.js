import React from 'react'
import { Step2 } from './Step2'
jest.mock('applications/PDF/components/PDFEditor/PDFEditor', () => {
  return () => { return <div className='mock-pdfeditor' /> }
})

describe('applications/BUC/components/Step1/Step1', () => {
  let wrapper
  const initialMockProps = {
    files: {},
    setFiles: jest.fn(),
    setStep: jest.fn(),
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<Step2 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Presses next button', () => {
    expect(wrapper.exists('#a-buc-c-sedattachmnents__next-button-id')).toBeTruthy()
    const button = wrapper.find('#a-buc-c-sedattachmnents__next-button-id').hostNodes()
    button.simulate('click')
    expect(initialMockProps.setStep).toHaveBeenCalledWith('generate')
  })

  it('Presses back button', () => {
    expect(wrapper.exists('#a-buc-c-sedattachmnents__back-button-id')).toBeTruthy()
    const button = wrapper.find('#a-buc-c-sedattachmnents__back-button-id').hostNodes()
    button.simulate('click')
    expect(initialMockProps.setStep).toHaveBeenCalledWith('select')
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments__step2')).toBeTruthy()
    expect(wrapper.exists('.mock-pdfeditor')).toBeTruthy()
  })
})
