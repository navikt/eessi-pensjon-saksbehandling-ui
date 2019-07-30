import React, { Suspense } from 'react'
import SEDAttachments from './SEDAttachments'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
    files: {},
    setFiles: jest.fn()
  }
  let wrapper

  beforeEach(() => {

  })

  it('Renders', () => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <SEDAttachments {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <SEDAttachments {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
    expect(wrapper.exists('.a-buc-c-sedattachments')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedattachments__enable-button-id')).toBeTruthy()
  })

  it('Pressing button for attachments leads to step 1', () => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <SEDAttachments {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
    expect(wrapper.exists('.a-buc-c-sedattachments-step1')).toBeFalsy()

    wrapper.find('#a-buc-c-sedattachments__enable-button-id').hostNodes().simulate('click')
    expect(wrapper.exists('.a-buc-c-sedattachments-step1')).toBeTruthy()
  })

  it('Step 2 can be seen', () => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <SEDAttachments {...initialMockProps} initialStep={2}/>
      </Suspense>
    </StoreProvider>)
    expect(wrapper.exists('.a-buc-c-sedattachments-step2')).toBeTruthy()
  })
})
