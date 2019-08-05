import React from 'react'
import PdfWidget from './PdfWidget'
jest.mock('react-router-dom', () => {
  return {
    Link: () => { return <div className='mock-link' /> }
  }
})

describe('widgets/PdfWidget', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      title: 'mockTitle'
    }
  }

  beforeEach(() => {
    wrapper = mount(<PdfWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-PdfWidget')).toBeTruthy()
    expect(wrapper.exists('Lenkepanel')).toBeTruthy()
  })
})
