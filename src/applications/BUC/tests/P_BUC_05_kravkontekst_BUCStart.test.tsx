import { within } from '@testing-library/dom'
import { createBuc } from 'src/actions/buc'
import BUCStart, { BUCStartProps } from 'src/applications/BUC/components/BUCStart/BUCStart'
import * as constants from 'src/constants/constants'
import { AllowedLocaleString } from 'src/declarations/app'
import { SakTypeMap } from 'src/declarations/buc.d'
import { fireEvent, render, screen } from '@testing-library/react'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockSubjectAreaList from 'src/mocks/buc/subjectAreaList'
import mockTagsList from 'src/mocks/buc/tagsList'
import { stageSelector } from 'src/setupTests'
import {BUCStartSelector} from "src/applications/BUC/components/BUCStart/BUCStartIndex";

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

describe('P_BUC_05 for BUCStart, kravkontekst', () => {
  let wrapper: any

  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn(),
    onBucChanged: jest.fn()
  }

  /*
    EP 942 - Scenario 1:

    Gitt at saksbehandler navigerer fra kravkontekst
    OG EESSI-Pensjon har informasjon om sakId
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er ALDER, UFOREP, GENRL, eller OMSORG
    OG saksbehandler velger å opprette en ny BUC
    Så vises P_BUC_05 i nedtrekkslista
    Slik at saksbehandler kan opprette P_BUC_05 i EP
    OG kan bestille SED P8000 i EP for denne BUC-en
   */
  it('EP-942 Scenario 1: Opprette P_BUC_05 - kravkontekst', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.KRAVKONTEKST,
      sakType: SakTypeMap.ALDER
    })

    wrapper = render(<BUCStart {...initialMockProps} />)

    // initial form inputs
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id\'] input')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()

    // select P_BUC_02
    const select = within(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })

    expect(initialMockProps.onBucChanged).toHaveBeenCalledWith({
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })

  /*
    EP 942 - Scenario 2:

    Gitt at saksbehandler navigerer fra kravkontekst
    OG EESSI-Pensjon har informasjon om sakId
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er GJENLEV eller BARNEP,
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG saksbehandler må legge inn avdødes fnr/dnr
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    OG saksbehandler svarer at henvendelsen gjelder avdøde
    Slik at P_BUC_05 kan opprettes på avdøde i RINA
    OG saksbehandler kan bestille SED P8000
   */
  it('EP-942 Scenario 2: Opprette P_BUC_05 - kravkontekst etterlatteytelser (avdøde)', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.KRAVKONTEKST,
      sakType: SakTypeMap.GJENLEV
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })

  /*
   EP 942 - Scenario 3:

    Gitt at saksbehandler navigerer fra kravkontekst
    OG EESSI-Pensjon har informasjon om sakId
    SÅ finner EP (backend) hvilken sakstype denne saken gjelder
    OG sakstype er GJENLEV eller BARNEP,
    OG saksbehandler velger å opprette en ny BUC
    Så kan saksbehandler velge P_BUC_05 i nedtrekkslista i EP
    OG saksbehandler må legge inn avdødes fnr/dnr
    OG det stilles spørsmål om henvendelsen gjelder den avdøde eller bruker
    OG saksbehandler svarer at henvendelsen gjelder bruker/søker
    Slik at P_BUC_05 kan opprettes på avdøde i RINA
    OG saksbehandler kan bestille SED P8000
  */
  it('EP-942 scenario 3: Opprette P_BUC_05 - kravkontekst - etterlatteytelser (bruker)', () => {
    (initialMockProps.onBucChanged as jest.Mock).mockReset();
    (createBuc as jest.Mock).mockReset()

    stageSelector(defaultSelector, {
      bucOptions: ['P_BUC_02', 'P_BUC_05'],
      personAvdods: [],
      pesysContext: constants.KRAVKONTEKST,
      sakType: SakTypeMap.BARNEP
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
      label: 'P_BUC_05 - buc:buc-P_BUC_05',
      value: 'P_BUC_05'
    })

    // show avdod fnr select
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    // keep kravDato input hidden
    expect(screen.getByTestId('a_buc_c_BUCStart--kravDato-input-id')).not.toBeInTheDocument()
    // click forward button
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    // no validation errors
    expect(screen.getByTestId('a_buc_c_BUCStart--feiloppsummering-id')).not.toBeInTheDocument()
    // submit payload and create BUC
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_05',
      person: undefined
    })
  })
})
