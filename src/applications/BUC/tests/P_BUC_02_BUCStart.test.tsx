import { createBuc } from 'actions/buc'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'constants/constants'
import { AllowedLocaleString } from 'declarations/app'
import { render, screen } from '@testing-library/react'
import mockFeatureToggles from 'mocks/app/featureToggles'
import mockPersonAvdods from 'mocks/person/personAvdod'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockTagsList from 'mocks/buc/tagsList'
import { stageSelector } from 'setupTests'
import {BUCStartSelector} from "applications/BUC/components/BUCStart/BUCStartIndex";

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
  kravDato: undefined,
  kravId: undefined,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  personPdl: undefined,
  personAvdods: [],
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  sakType: undefined,
  subjectAreaList: mockSubjectAreaList,
  tagList: mockTagsList
}

describe('P_BUC_02 for BUCStart', () => {
  let wrapper: any

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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // shows avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // does not show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    // keep kravDado hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()

    expect(wrapper.find('[data-testid=\'a_buc_c_BUCStart--warning-id').hostNodes().render().text()).toEqual('advarselmessage:alert-noDeceased')
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

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.update()
    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_02 - buc:buc-P_BUC_02',
      value: 'P_BUC_02'
    })

    // does show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeInTheDocument()
    // keep kravDato hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // validation error, must choose avdod
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).toBeInTheDocument()
    expect(wrapper.find('[data-testid=\'a_buc_c_BUCStart--feiloppsummering-id').hostNodes().render().text()).toEqual(
      'buc:form-feiloppsummering' + 'message:validation-chooseAvdod'
    )
    // create buc is not called
    expect(createBuc).not.toHaveBeenCalled()
  })
})
