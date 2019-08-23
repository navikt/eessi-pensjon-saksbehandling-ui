import React from 'react'
import Step2 from './Step2'
import sampleBucs from 'resources/tests/sampleBucs'
jest.mock('applications/BUC/components/SEDP4000/SEDP4000', () => {
  return () => { return <div className='mock-sedp4000' /> }
})

describe('applications/BUC/components/SEDStart/Step2', () => {
  let wrapper

  const bucReducer = (currentBucs, newBuc) => {
    currentBucs[newBuc.caseId] = newBuc
    return currentBucs
  }
  const mockBucs = sampleBucs.reduce(bucReducer, {})

  const initialMockProps = {
    buc: mockBucs['195440'],
    _sed: 'P4000',
    t: jest.fn((translationString) => { return translationString }),
    showButtons: true,
    setShowButtons: jest.fn()
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
