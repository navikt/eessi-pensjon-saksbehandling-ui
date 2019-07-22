import React, { Suspense } from 'react'
import Step2 from './Step2'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'

describe('applications/BUC/components/Step1/Step1', () => {

  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
    files: {},
    setFiles: jest.fn()
  }
  let wrapper

  beforeEach(() => {
      wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
        <Suspense fallback={<div/>}>
          <Step2 {...initialMockProps} />
        </Suspense>
      </StoreProvider>)
  })

  it('Renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })


  it('Render()', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments-step2')).toEqual(true)
    expect(wrapper.exists('PDFEditor')).toEqual(true)
  })
})
