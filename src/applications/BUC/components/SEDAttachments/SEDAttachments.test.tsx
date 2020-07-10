import { JoarkFile } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockJoarkReduced from 'mocks/joark/joarkReduced'
import SEDAttachments, { SEDAttachmentsProps } from './SEDAttachments'

jest.mock('components/JoarkBrowser/JoarkBrowser', () =>
  (props: any) => (<div className='mock-joarkbrowser' onClick={() => props.onFilesChange([{ foo: 'bar' }])} />)
)

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentsProps = {
    files: {},
    onFilesChange: jest.fn(),
    open: true,
    onOpen: jest.fn(),
    onSubmit: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<SEDAttachments {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<SEDAttachments {...initialMockProps} open={false} />)
    expect(wrapper.exists('.a-buc-c-sedattachments')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedattachments__enable-button-id')).toBeTruthy()
  })

  it('onFilesChanged triggered', () => {
    (initialMockProps.onFilesChange as jest.Mock).mockReset()
    wrapper.find('.mock-joarkbrowser').simulate('click')
    expect(initialMockProps.onFilesChange).toHaveBeenCalledWith([{ foo: 'bar' }])
  })

  it('onSubmit triggered', () => {
    (initialMockProps.onOpen as jest.Mock).mockReset()
    wrapper = mount(<SEDAttachments {...initialMockProps} files={{ joark: [(mockJoarkReduced[0] as JoarkFile)] }} />)
    // @ts-ignore
    wrapper.find('button.a-buc-c-sedattachments__submit-button').props().onClick()
    expect(initialMockProps.onSubmit).toHaveBeenCalledWith({ joark: [(mockJoarkReduced[0] as JoarkFile)] })
  })

  it('onEnableAttachmentsButtonClicked triggered', () => {
    (initialMockProps.onOpen as jest.Mock).mockReset()
    wrapper = mount(<SEDAttachments {...initialMockProps} open={false} />)
    // @ts-ignore
    wrapper.find('Knapp.a-buc-c-sedattachments__enable-button').props().onClick()
    expect(initialMockProps.onOpen).toHaveBeenCalled()
  })
})
