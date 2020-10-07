import {
  createSed,
  fetchBucs,
  getCountryList, getInstitutionsListForBucAndCountry,
  getSedList,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { Bucs } from 'declarations/buc'
import { JoarkFile } from 'declarations/joark'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import personAvdod from 'mocks/app/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import React from 'react'
import { stageSelector } from 'setupTests'
import { SEDStart, SEDStartProps, SEDStartSelector } from './SEDStart'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockItems from 'mocks/joark/items'

jest.mock('actions/buc', () => ({
  createReplySed: jest.fn(),
  createSavingAttachmentJob: jest.fn(),
  createSed: jest.fn(),
  getCountryList: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  getSedList: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  resetSed: jest.fn(),
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn(),
  setSedList: jest.fn()
}))

const defaultSelector: SEDStartSelector = {
  attachmentsError: false,
  countryList: [],
  currentSed: undefined,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  institutionList: {},
  loading: {},
  locale: 'nb',
  personAvdods: personAvdod(1),
  pesysContext: VEDTAKSKONTEKST,
  sakId: '123',
  savingAttachmentsJob: undefined,
  sed: undefined,
  sedsWithAttachments: {},
  sedList: undefined,
  vedtakId: undefined
}

describe('applications/BUC/components/SEDStart/SEDStart', () => {
  let wrapper: ReactWrapper

  const initialMockProps: SEDStartProps = {
    aktoerId: '123',
    bucs: _.keyBy(mockBucs(), 'caseId'),
    currentBuc: '195440',
    initialAttachments: mockItems,
    initialSed: 'P2000',
    onSedCreated: jest.fn(),
    onSedCancelled: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDStart {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedstart')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__forward-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedstart__cancel-button-id')).toBeTruthy()
  })

  it('UseEffect: getCountryList', () => {
    (getCountryList as jest.Mock).mockReset()
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(getCountryList).toHaveBeenCalled()
  })

  it('UseEffect: getSedList with no currentSed ', () => {
    (getSedList as jest.Mock).mockReset()
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(getSedList).toHaveBeenCalledWith(initialMockProps.bucs[initialMockProps.currentBuc])
  })

  it('UseEffect: getSedList with valid currentSed ', () => {
    (setSedList as jest.Mock).mockReset()
    stageSelector(defaultSelector, { currentSed: '90149c52a98044b599c3bf5d48537782' })
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(setSedList).toHaveBeenCalledWith(['P6000'])
  })

  it('UseEffect: getInstitutionsListForBucAndCountry', () => {
    (getInstitutionsListForBucAndCountry as jest.Mock).mockReset()
    wrapper = mount(<SEDStart {...initialMockProps} />)
    expect(getInstitutionsListForBucAndCountry).toHaveBeenCalled()
  })

  it('UseEffect: sendAttachmentToSed start', () => {
    expect(sendAttachmentToSed).not.toHaveBeenCalled()
    stageSelector(defaultSelector, { sed: { id: 'mockSedId' } })
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

  it('UseEffect: sendAttachmentToSed end', () => {
    stageSelector(defaultSelector, { sed: { id: 'mockSedId' } })
    wrapper = mount(<SEDStart {...initialMockProps} initialAttachments={{ joark: [] }} />)
    expect(resetSed).toHaveBeenCalled()
    expect(resetSedAttachments).toHaveBeenCalled()
    expect(fetchBucs).toHaveBeenCalled()
    expect(initialMockProps.setMode).toHaveBeenCalledWith('bucedit')
  })

  it('With a BUC with SEDs that have NO participants, demand a institution', () => {
    stageSelector(defaultSelector, {})
    const mockBucsWithNoParticipants: Bucs = _.keyBy(mockBucs(), 'caseId')
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
