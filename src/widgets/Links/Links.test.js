import React from 'react'
import { Links } from './Links'
jest.mock('react-router-dom', () => {
  return {
    Link: () => { return <div className='mock-link' /> }
  }
})

describe('widgets/Links/Links', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<Links {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-links')).toBeTruthy()
    expect(wrapper.exists('Lenkepanel')).toBeTruthy()
  })
})
