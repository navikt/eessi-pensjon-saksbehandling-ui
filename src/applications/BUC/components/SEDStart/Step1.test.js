import React from 'react'
import Step1 from './Step1'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDStart/Step1', () => {

  let wrapper

  const bucReducer = (currentBucs, newBuc) => {
    currentBucs[newBuc.caseId] = newBuc
    return currentBucs
  }
  const mockBucs = sampleBucs.reduce(bucReducer, {})

  const initialMockProps = {
    actions: {},
    attachments: [],
    buc: mockBucs['195440'],
    _countries: [],
    countryList: [],
    _institutions: [],
    institutionList: {},
    loading: {},
    locale: 'nb',
    _sed: undefined,
    setAttachments: jest.fn(),
    setCountries: jest.fn(),
    setInstitutions: jest.fn(),
    sedList: ['P2000', 'P4000'],
    sedNeedsVedtakId: () => {return false},
    setSed: jest.fn(),
    setValidation: jest.fn(),
    setVedtakId: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    validation: {},
    vedtakId: '123'
  }

  beforeEach(() => {
    wrapper = mount(<Step1 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('#a-buc-c-sedstart__sed-select-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__country-select-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__institution-select-id')).toBeTruthy()
  })
})
