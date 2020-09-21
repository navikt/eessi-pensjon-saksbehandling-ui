import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import SEDAttachmentsTable, { SEDAttachmentsTableProps } from './SEDAttachmentsTable'

describe('applications/BUC/components/SEDAttachments/SEDAttachments', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDAttachmentsTableProps = {
    highContrast: false,
    attachments: {
      joark: [{
        journalpostId: '1',
        title: 'blue.pdf',
        tema: 'foo',
        date: new Date(Date.parse('2018-12-27T14:42:24')),
        dokumentInfoId: '4',
        variant: {
          variantformat: 'ARKIV',
          filnavn: '23534345.pdf'
        }
      }],
      sed: [{
        journalpostId: '2',
        title: 'red.pdf',
        tema: 'bar',
        date: new Date(Date.parse('2018-12-17T14:42:24')),
        dokumentInfoId: '5',
        variant: {
          variantformat: 'ARKIV',
          filnavn: '98734213487.pdf'
        }
      }]
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
