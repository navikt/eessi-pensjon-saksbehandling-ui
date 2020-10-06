import { mount, ReactWrapper } from 'enzyme'
import joarkBrowserItems from 'mocks/joark/items'
import React from 'react'
import SEDAttachmentModal, { SEDAttachmentModalProps } from './SEDAttachmentModal'

jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div className='mock-joarkbrowser' />
})

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentModalProps = {
    highContrast: false,
    onFinishedSelection: jest.fn(),
    onModalClose: jest.fn(),
    sedAttachments: joarkBrowserItems,
    tableId: 'test-id'
  }

  beforeEach(() => {
    wrapper = mount(<SEDAttachmentModal {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedattachmentmodal__joarkbrowser-id\']')).toBeTruthy()
  })
})
