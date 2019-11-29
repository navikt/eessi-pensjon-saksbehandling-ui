import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'
import Step2, { Step2Props } from './Step2'

jest.mock('applications/BUC/components/SEDP4000/SEDP4000', () => {
  return () => { return <div className='mock-sedp4000' /> }
})

describe('applications/BUC/components/SEDStart/AttachmentStep2', () => {
  let wrapper: ReactWrapper
  const mockBucs = _.keyBy(sampleBucs, 'caseId')
  const initialMockProps: Step2Props = {
    buc: mockBucs['195440'],
    locale: 'nb',
    _sed: 'P4000',
    t: jest.fn(t => t),
    showButtons: true,
    setShowButtons: jest.fn(),
    validation: {},
    setValidation: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<Step2 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.mock-sedp4000')).toBeTruthy()
  })
})
