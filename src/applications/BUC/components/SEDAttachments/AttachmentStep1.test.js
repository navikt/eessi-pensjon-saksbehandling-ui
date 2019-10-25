import React from 'react'
import { AttachmentStep1 } from './AttachmentStep1'
jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return (props) => {
    return <div className='mock-joarkbrowser' onClick={() => props.onFilesChange([{ foo: 'bar' }])} />
  }
})

describe('applications/BUC/components/AttachmentStep1/AttachmentStep1', () => {
  let wrapper

  const initialMockProps = {
    files: {},
    setFiles: jest.fn(),
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<AttachmentStep1 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments__step1')).toBeTruthy()
    expect(wrapper.exists('.mock-joarkbrowser')).toBeTruthy()
  })

  it('onFilesChanged triggered', () => {
    wrapper.find('.mock-joarkbrowser').simulate('click')
    expect(initialMockProps.setFiles).toHaveBeenCalledWith({ joark: [{ foo: 'bar' }] })
  })
})
