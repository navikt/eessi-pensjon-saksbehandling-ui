import React, { Suspense } from 'react'
import Step1 from './Step1'
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
          <Step1 {...initialMockProps} />
        </Suspense>
      </StoreProvider>)
  })

  it('Renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })


  it('Render()', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments-step1')).toEqual(true)
    expect(wrapper.exists('JoarkBrowser')).toEqual(true)
  })
})
