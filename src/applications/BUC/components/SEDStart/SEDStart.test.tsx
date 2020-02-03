import { createSed, getCountryList, getSedList, resetSed, sendAttachmentToSed } from 'actions/buc'
import { Bucs } from 'declarations/buc'
import { JoarkFile } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleP4000info from 'resources/tests/sampleP4000info'
import targetP4000info from 'resources/tests/targetP4000info'
import { SEDStart, SEDStartProps, SEDStartSelector } from './SEDStart'

jest.mock('applications/BUC/components/SEDP4000/SEDP4000', () => ({ children }: {children: JSX.Element}) => (
  <div className='mock-sedP4000'>
    {children}
  </div>
))

jest.mock('actions/buc', () => ({
  createSed: jest.fn(),
  getCountryList: jest.fn(),
  getSedList: jest.fn(),
  resetSed: jest.fn(),
  sendAttachmentToSed: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: SEDStartSelector = {
  attachments: {sed: [], joark :[]},
  attachmentsError: false,
  avdodfnr: undefined,
  bucsInfoList: undefined,
  countryList: [],
  institutionList: {},
  loading: {},
  locale: 'nb',
  sakId: '123',
  sed: undefined,
  sedList: undefined,
  p4000info: sampleP4000info,
  vedtakId: undefined
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

describe('applications/BUC/components/SEDStart/SEDStart', () => {
  let wrapper: ReactWrapper
  const mockBucs: Bucs = _.keyBy(sampleBucs, 'caseId')

  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: mockBucs,
    currentBuc: '195440',
    initialAttachments: {
      joark: [{
        tittel: 'tittel',
        tema: 'tema',
        datoOpprettet: new Date(2020, 1, 1),
        journalpostId: '456',
        dokumentInfoId: '789',
        variant: {
          variantformat: 'ARKIV',
          filnavn: 'mockFilename'
        }
      }]
    },
    initialSed: 'P2000',

    setMode: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<SEDStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: getCountryList', () => {
    expect(getCountryList).toHaveBeenCalled()
  })

  it('UseEffect: getSedList', () => {
    expect(getSedList).toHaveBeenCalled()
  })

  it('UseEffect: sendAttachmentToSed', () => {
    expect(sendAttachmentToSed).not.toHaveBeenCalled();
    (useSelector as jest.Mock).mockImplementation(() => ({
      ...defaultSelector,
      sed: {
        id: 'mockSedId'
      }
    }))
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(sendAttachmentToSed).toHaveBeenCalledWith({
      aktoerId: initialMockProps.aktoerId,
      rinaId: initialMockProps.currentBuc,
      rinaDokumentId: 'mockSedId',
      journalpostId: (initialMockProps.initialAttachments!.joark[0] as JoarkFile).journalpostId,
      dokumentInfoId: (initialMockProps.initialAttachments!.joark[0] as JoarkFile).dokumentInfoId,
      variantformat: (initialMockProps.initialAttachments!.joark[0] as JoarkFile).variant.variantformat
    }, initialMockProps.initialAttachments!.joark[0])
  })

  it('With a BUC with SEDs that have NO participants, demand a institution', () => {
    (useSelector as jest.Mock).mockImplementation(() => (defaultSelector))
    const mockBucsWithNoParticipants: Bucs = _.cloneDeep(mockBucs)
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].institusjon = []
    mockBucsWithNoParticipants[initialMockProps.currentBuc!].seds = []
    wrapper = mount(<SEDStart {...initialMockProps} bucs={mockBucsWithNoParticipants} />)
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'mockSed' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
  })

  it('With a BUC with SEDs that have participants, no need to demand a institution', () => {
    wrapper = mount(<SEDStart {...initialMockProps} initialSed={undefined} />)
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'mockSed' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(false)
  })

  it('With SED P4000 we do not need more steps', () => {
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().render().text()).toEqual('buc:form-orderSED')
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'P4000' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().render().text()).toEqual('buc:form-orderSED')
  })

  it('With SED P4000 we get a proper submit', () => {
    (createSed as jest.Mock).mockReset()
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().simulate('click')
    expect(createSed).toHaveBeenCalledWith({
      aktoerId: '123',
      buc: 'P_BUC_02',
      euxCaseId: '195440',
      institutions: [],
      periodeInfo: targetP4000info.trygdetid,
      sed: 'P4000',
      sakId: '123'
    })
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedstart')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__forward-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__cancel-button-id')).toBeTruthy()
  })

  it('Renders with step 1', () => {
    expect(wrapper.find('Step1')).toBeTruthy()
  })

  it('Renders with step 2', () => {
    wrapper = mount(<SEDStart {...initialMockProps} initialStep={1} />)
    expect(wrapper.find('Step2')).toBeTruthy()
  })

  it('Creates sed when forward button is clicked ', () => {
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().prop('disabled')).toBeFalsy()
    wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().simulate('click')
    expect(createSed).toHaveBeenCalledWith({
      aktoerId: '123',
      buc: 'P_BUC_02',
      euxCaseId: '195440',
      institutions: [],
      sakId: '123',
      sed: 'P2000'
    })
  })

  it('Cancels sed when cancel button is clicked ', () => {
    wrapper.find('#a-buc-c-sedstart__cancel-button-id').hostNodes().simulate('click')
    expect(resetSed).toHaveBeenCalled()
    expect(initialMockProps.setMode).toHaveBeenCalledWith('bucedit')
  })
})
