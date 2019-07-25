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
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div />}>
        <SEDAttachments {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Pressing button for attachments makes it disappear', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedattachments__enable-button-id')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedattachments-step1')).toBeFalsy()

    wrapper.find('#a-buc-c-sedattachments__enable-button-id').hostNodes().simulate('click')
    expect(wrapper.find('.a-buc-c-sedattachments-step1')).toHaveLength(1)
    expect(wrapper.render().find('#a-buc-c-sedattachments__enable-button-id')).toHaveLength(0)
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedattachments__enable-button-id')).toBeTruthy()
  })
})
