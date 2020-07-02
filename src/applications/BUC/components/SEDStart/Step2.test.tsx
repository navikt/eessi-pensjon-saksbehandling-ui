import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import Step2, { Step2Props } from './Step2'

describe('applications/BUC/components/SEDStart/AttachmentStep2', () => {
  let wrapper: ReactWrapper
  const _mockBucs = _.keyBy(mockBucs(), 'caseId')
  const initialMockProps: Step2Props = {
    aktoerId: '123',
    buc: _mockBucs['195440'],
    locale: 'nb',
    _sed: 'P4000',
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

})
