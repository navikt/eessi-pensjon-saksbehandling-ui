import React from 'react'
import SEDBody from './SEDBody'

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper

  const initialMockProps = {
    t: jest.fn((translationString) => {
      return translationString
    }),
    sed: {
      attachments: []
    }
  }

  beforeEach(() => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedbody')).toBeTruthy()
  })
})
