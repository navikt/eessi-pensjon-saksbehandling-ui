import { Bucs } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import Step1, { Step1Props } from './Step1'

describe('applications/BUC/components/SEDStart/Step1', () => {
  let wrapper: ReactWrapper
  const _mockBucs: Bucs = _.keyBy(mockBucs(), 'caseId')
  const initialMockProps: Step1Props = {
    _attachments: {},
    avdodfnr: 123,
    buc: _mockBucs['195440'],
    _countries: [],
    countryList: [],
    _institutions: [],
    institutionList: {
      NO: [{
        akronym: 'DEMO001',
        navn: 'Demo 001',
        landkode: 'NO',
        id: 'NO:DEMO001'
      }]
    },
    loading: {},
    layout: 'row',
    locale: 'nb',
    _sed: undefined,
    setAttachments: jest.fn(),
    setCountries: jest.fn(),
    setInstitutions: jest.fn(),
    sedList: ['P2000', 'P4000'],
    sedNeedsVedtakId: () => false,
    sedNeedsAvdodfnr: () => false,
    sedCanHaveAttachments: () => true,
    setSed: jest.fn(),
    setValidation: jest.fn(),
    setVedtakId: jest.fn(),
    setAvdodfnr: jest.fn(),
    validation: {},
    vedtakId: 123
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

  it('lets select SED', () => {
    wrapper.find('select#a-buc-c-sedstart__sed-select-id').simulate('change', { target: { value: 'P2000' } })
    expect(initialMockProps.setSed).toHaveBeenCalledWith('P2000')
  })
})
