import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleJoarkReduced from 'resources/tests/sampleJoarkReduced'
import SEDAttachmentsTable, { SEDAttachmentsTableProps } from './SEDAttachmentsTable'

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentsTableProps = {
    attachments: {
      joark: [sampleJoarkReduced[0]],
      sed: [sampleJoarkReduced[2]]
    },
    t: jest.fn(t => t)
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
