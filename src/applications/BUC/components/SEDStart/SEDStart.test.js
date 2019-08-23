import React from 'react'
import { SEDStart } from './SEDStart'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDStart/SEDStart', () => {
  let wrapper

  const bucReducer = (currentBucs, newBuc) => {
    currentBucs[newBuc.caseId] = newBuc
    return currentBucs
  }
  const mockBucs = sampleBucs.reduce(bucReducer, {})

  const initialMockProps = {
    actions: {
      getCountryList: jest.fn(),
      getSedList: jest.fn(),
      sendAttachmentToSed: jest.fn(),
      resetSed: jest.fn(),
      fetchBucs: jest.fn(),
      setMode: jest.fn()
    },
    aktoerId: '123',
    attachments: [],
    avdodfnr: undefined,
    bucs: mockBucs,
    bucsInfoList: {},
    countryList: [],
    currentBuc: '195440',
    initialAttachments: {
      joark: [{
        journalpostId: '456',
        dokumentInfoId: '789',
        variant: 'ARKIV'
      }]
    },
    institutionList: {},
    loading: {},
    locale: 'nb',
    p4000info: {},
    sakId: '123',
    sed: undefined,
    t: jest.fn((translationString) => { return translationString }),
    vedtakId: '123'
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
    expect(initialMockProps.actions.getCountryList).toHaveBeenCalled()
  })

  it('UseEffect: getSedList', () => {
    expect(initialMockProps.actions.getSedList).toHaveBeenCalled()
  })

  it('UseEffect: sendAttachmentToSed', () => {
    expect(initialMockProps.actions.sendAttachmentToSed).not.toHaveBeenCalled()
    wrapper.setProps({ sed: { id: 'mockSedId' } })
    expect(initialMockProps.actions.sendAttachmentToSed).toHaveBeenCalledWith({
      aktoerId: initialMockProps.aktoerId,
      rinaId: initialMockProps.currentBuc,
      rinaDokumentId: 'mockSedId',
      joarkJournalpostId: initialMockProps.initialAttachments.joark[0].journalpostId,
      joarkDokumentInfoId: initialMockProps.initialAttachments.joark[0].dokumentInfoId,
      variantFormat: initialMockProps.initialAttachments.joark[0].variant
    })
    wrapper.setProps({ attachments: [{ id: 'mockSedId' }] })
    expect(initialMockProps.actions.resetSed).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchBucs).toHaveBeenCalledWith(initialMockProps.aktoerId)
    expect(initialMockProps.actions.setMode).toHaveBeenCalledWith('bucedit')
  })

  it('With a BUC with SEDs that have NO participants, demand a institution', () => {
    const _mockBucs = {
      [initialMockProps.currentBuc]: { seds: [] }
    }
    wrapper = mount(<SEDStart {...initialMockProps} bucs={_mockBucs} />)
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'mockSed' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
  })

  it('With a BUC with SEDs that have participants, no need to demand a institution', () => {
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(true)
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'mockSed' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().props().disabled).toEqual(false)
  })

  it('With SED P4000 we need more steps', () => {
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().render().text()).toEqual('buc:form-orderSED')
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'P4000' } })
    expect(wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().render().text()).toEqual('ui:next')
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
})
