import React from 'react'
import { SEDStart } from './SEDStart'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleP4000info from 'resources/tests/sampleP4000info'
import targetP4000info from 'resources/tests/targetP4000info'
jest.mock('applications/BUC/components/SEDP4000/SEDP4000', () => {
  return ({ children }) => {
    return (
      <div className='mock-sedP4000'>
        {children}
      </div>
    )
  }
})

describe('applications/BUC/components/SEDStart/SEDStart', () => {
  let wrapper

  const bucReducer = (currentBucs, newBuc) => {
    currentBucs[newBuc.caseId] = newBuc
    return currentBucs
  }
  const mockBucs = sampleBucs.reduce(bucReducer, {})

  const initialMockProps = {
    actions: {
      createSed: jest.fn(),
      getCountryList: jest.fn(),
      getSedList: jest.fn(),
      sendAttachmentToSed: jest.fn(),
      resetSed: jest.fn(),
      resetSedAttachments: jest.fn(),
      fetchBucs: jest.fn()
    },
    aktoerId: '123',
    attachments: [],
    avdodfnr: undefined,
    bucs: mockBucs,
    bucsInfoList: [],
    countryList: [],
    currentBuc: '195440',
    initialAttachments: {
      joark: [{
        journalpostId: '456',
        dokumentInfoId: '789',
        variant: {
          variantformat: 'ARKIV',
          filnavn: 'mockFilename'
        }
      }]
    },
    initialSed: 'P2000',
    institutionList: {},
    loading: {},
    locale: 'nb',
    p4000info: sampleP4000info,
    sakId: '123',
    sed: undefined,
    setMode: jest.fn(),
    t: jest.fn(t => t),
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
      journalpostId: initialMockProps.initialAttachments.joark[0].journalpostId,
      dokumentInfoId: initialMockProps.initialAttachments.joark[0].dokumentInfoId,
      variantformat: initialMockProps.initialAttachments.joark[0].variant.variantformat
    }, initialMockProps.initialAttachments.joark[0])
    wrapper.setProps({ attachments: [{ id: 'mockSedId' }] })
    expect(initialMockProps.actions.resetSed).toHaveBeenCalled()
    expect(initialMockProps.actions.fetchBucs).toHaveBeenCalledWith(initialMockProps.aktoerId)
    expect(initialMockProps.setMode).toHaveBeenCalledWith('bucedit')
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
    initialMockProps.actions.createSed.mockReset()
    wrapper.find('#a-buc-c-sedstart__sed-select-id').hostNodes().simulate('change', { target: { value: 'P4000' } })
    wrapper.find('#a-buc-c-sedstart__forward-button-id').hostNodes().simulate('click')
    expect(initialMockProps.actions.createSed).toHaveBeenCalledWith({
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
    expect(initialMockProps.actions.createSed).toHaveBeenCalledWith({
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
    expect(initialMockProps.actions.resetSed).toHaveBeenCalled()
    expect(initialMockProps.setMode).toHaveBeenCalledWith('bucedit')
  })
})
