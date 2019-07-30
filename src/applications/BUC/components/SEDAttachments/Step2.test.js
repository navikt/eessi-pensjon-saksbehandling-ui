import React, { Suspense } from 'react'
import Step2 from './Step2'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'

describe('applications/BUC/components/Step1/Step1', () => {
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
    files: {},
    setFiles: jest.fn(),
    setStep: jest.fn()
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <Step2 {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
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
    expect(wrapper.exists('.a-buc-c-sedattachments-step2')).toBeTruthy()
    expect(wrapper.exists('PDFEditor')).toBeTruthy()
  })
})
