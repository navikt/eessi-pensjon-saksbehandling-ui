import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockJoarkReduced from 'mocks/joark/joarkReduced'
import SEDAttachmentsTable, { SEDAttachmentsTableProps } from './SEDAttachmentsTable'

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentsTableProps = {
    attachments: {
      joark: [mockJoarkReduced[0]],
      sed: [mockJoarkReduced[2]]
    }
  }

  beforeEach(() => {
    wrapper = mount(<SEDAttachmentsTable {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<SEDAttachmentsTable {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-sedattachmentstable')).toBeTruthy()
  })
})
