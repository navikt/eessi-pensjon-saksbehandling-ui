import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps, BUCStartSelector } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { mount, ReactWrapper } from 'enzyme'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockPersonAvdods from 'mocks/app/personAvdod'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockTagsList from 'mocks/buc/tagsList'
import { stageSelector } from 'setupTests'

jest.mock('actions/buc', () => ({
  cleanNewlyCreatedBuc: jest.fn(),
  createBuc: jest.fn()
}))

const defaultSelector: BUCStartSelector = {
  bucOptions: [],
  bucParam: undefined,
  bucs: {},
  bucsInfo: undefined,
  currentBuc: undefined,
  featureToggles: mockFeatureToggles,
  highContrast: false,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  person: undefined,
  personAvdods: [],
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('P_BUC_02 for BUCStart', () => {
  let wrapper: ReactWrapper

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 899 - Scenario 1:

    Gitt at saksbehandler navigerer fra PESYS via jordkloden i Vedtakshistorikken
    OG det finnes en avdøde i vedtaket (som ikke er bruker selv)
    Så vises pågående P_BUC_02 i startskjermbildet
    OG avdøde er den forsikrede
    OG bruker er søker
    Slik at saksbehandler kan bestille andre SED i EP for denne BUC-en
   */
  it('EP-899 Scenario 1: Oversikt over pågående P_BUC_02 - vedtakshistorikk m avdøde', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_01', 'P_BUC_02'],
      personAvdods: mockPersonAvdods(1),
      pesysContext: constants.VEDTAKSKONTEKST
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // shows avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato input hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      avdod: mockPersonAvdods(1)![0],
      buc: 'P_BUC_02',
      person: undefined
    })
  })

  /*
    EP 899 - Scenario 2:

    Gitt at saksbehandler navigerer fra PESYS via jordkloden i Vedtakshistorikken
    OG det finnes ingen avdøde i vedtaket (som ikke er bruker selv)
    Så vises det kun pågående P_BUC-er som gjelder brukeren i startskjermbildet
    Slik at saksbehandler ikke kan se pågående P_BUC_02 for aktuell bruker uten å navigere fra riktig vedtak
   */
  it('EP-899 Scenario 2: Oversikt over pågående P_BUC_02 - ingen avdøde i vedtaket (bruker har AP eller UT-sak, ukjent avdød?)', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_01', 'P_BUC_02'],
      personAvdods: [],
      pesysContext: constants.VEDTAKSKONTEKST
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // does not show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    // keep kravDado hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // no validation errors
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeFalsy()
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()

    expect(wrapper.find('[data-test-id=\'a-buc-c-bucstart__warning-id\']').hostNodes().render().text()).toEqual('advarselbuc:alert-noDeceased')
  })

  /*
    EP 899 - Scenario 3:

    Gitt at saksbehandler navigerer fra PESYS via jordkloden i Vedtakshistorikken
    OG det finnes to avdøde i vedtaket (som ikke er bruker selv)
    Så vises alle pågående P_BUC_02 i startskjermbildet, (dvs. for avdøde mor og avdøde far, hvor bruker er søker)
    OG avdøde er de forsikrede
    OG bruker er søker
    Slik at saksbehandler kan bestille SED i EP for aktuelle  BUC-er
   */
  it('EP-899 Scenario 3: Oversikt over pågående P_BUC_02 - to avdøde (foreldreløs)', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_01', 'P_BUC_02'],
      personAvdods: mockPersonAvdods(2),
      pesysContext: constants.VEDTAKSKONTEKST
    })

    wrapper = mount(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()

    // select P_BUC_02
    const select = wrapper.find('[data-test-id=\'a-buc-c-bucstart__buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // does show avdod fnr select
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__avdod-select-id\']')).toBeTruthy()
    // keep kravDato hidden
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__kravDato-input-id\']')).toBeFalsy()
    // click forward button
    wrapper.find('[data-test-id=\'a-buc-c-bucstart__forward-button-id\']').hostNodes().simulate('click')
    // validation error, must choose avdod
    expect(wrapper.exists('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']')).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-bucstart__feiloppsummering-id\']').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'buc:validation-chooseAvdod'
    )
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()
  })
})
