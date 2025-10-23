import BUCList, {
  BUCListProps,
  BUCListSelector
} from 'src/applications/BUC/pages/BUCList/BUCList'
import { BRUKERKONTEKST, VEDTAKSKONTEKST } from 'src/constants/constants'
import { render, screen } from '@testing-library/react'
import personAvdod from 'src/mocks/person/personAvdod'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import { stageSelector } from 'src/setupTests'
//import {BucLenkePanel} from "../CommonBucComponents";

jest.mock('applications/BUC/components/BUCFooter/BUCFooter', () => () => <div className='mock-bucfooter' />)

jest.mock('applications/BUC/components/BUCStart/BUCStart', () => ({ classname }: any) => (
  <div className={'mock-bucstart' + (classname ? ' ' + classname : '')} />)
)

jest.mock('actions/buc', () => ({
  fetchBucsInfo: jest.fn(),
  getInstitutionsListForBucAndCountry: jest.fn(),
  setCurrentBuc: jest.fn()
}))

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

const mockPersonAvdods = personAvdod(1)

const defaultSelector: BUCListSelector = {
  aktoerId: '123',
  sakType: undefined,
  bucsList: [{
    euxCaseId: 'NorwayIsCaseOwner',
    buctype: 'P_BUC_02',
    aktoerId: '123',
    saknr: '456',
    avdodFnr: null,
    kilde: 'pdl'
  }, {
    euxCaseId: 'NorwayIsNOTCaseOwner',
    buctype: 'P_BUC_02',
    aktoerId: '123',
    saknr: '456',
    avdodFnr: null,
    kilde: 'pdl'
  }],
  bucs: {
    NorwayIsCaseOwner: {
      cdm: "4.2",
      type: 'P_BUC_02',
      readOnly: false,
      caseId: 'NorwayIsCaseOwner',
      creator: {
        country: 'NO',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07',
        acronym: 'NAVAT07'
      },
      sakType: null,
      status: 'open',
      startDate: 1571818162145,
      lastUpdate: 1571818216000,
      institusjon: [{
        country: 'NO',
        acronym: 'NAVAT07',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07'
      }],
      seds: [],
      error: null
    },
    NorwayIsNOTCaseOwner: {
      cdm: "4.2",
      type: 'P_BUC_02',
      readOnly: false,
      caseId: 'NorwayIsNOTCaseOwner',
      creator: {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        name: 'SE Demo 01',
        acronym: 'DEMOSE01'
      },
      sakType: null,
      status: 'open',
      startDate: 1571818162145,
      lastUpdate: 1571818216000,
      institusjon: [{
        country: 'NO',
        acronym: 'NAVAT07',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07'
      }, {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        name: 'SE Demo 01',
        acronym: 'DEMOSE01'
      }],
      seds: [],
      error: null
    }
  },
  bucsInfo: mockBucsInfo,
  gettingBucsList: false,
  gettingBucs: false,
  locale: 'nb',
  newlyCreatedBuc: undefined,
  personAvdods: mockPersonAvdods,
  pesysContext: VEDTAKSKONTEKST
}

describe('P_BUC_02 for BUCStart', () => {
  let wrapper: any
  const initialMockProps: BUCListProps = {
    setMode: jest.fn()
  }

  /*
    EP 899 - Scenario 4:

    Gitt at Norge er sakseier av P_BUC_02
    OG saksbehandler navigerer fra PESYS
    OG bruker jordkloden i Brukeroversikten eller kravkontekst (EU/EØS-knappen)
    OG det finnes ingen vedtaksID
    OG saksbehandler åpner startskjermbildet i EP
    Så vises det kun pågående P_BUC-er som ikke er P_BUC_02 hvor Norge er sakseier
    Slik at saksbehandler ikke kan se pågående P_BUC_02 for aktuell bruker uten å navigere fra vedtakskontekst med avdøde i vedtaket

   */
  it('EP-899 Scenario 4: Oversikt over pågående P_BUC_02 - bruker kravkontekst eller brukeroversikten - Norge er sakseier', () => {
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST
    })
    render(<BUCList {...initialMockProps} />)

    //expect(wrapper.exists(BUCListDiv)).toBeTruthy()    //Disabled, as BUCListDiv does no longer exist in BUCList
    //expect(wrapper.find(BucLenkePanel).length).toEqual(1)    //Disabled, as BucLenkePanel does no longer exist in BUCList
    expect(screen.getByTestId('a_buc_c_BUCHeader--P_BUC_02-NorwayIsCaseOwner')).not.toBeInTheDocument()
  })

  /*
   EP 899 - Scenario 5:

    Gitt at Norge er deltaker i P_BUC_02
    OG saksbehandler navigerer fra PESYS
    OG bruker jordkloden i Brukeroversikten eller kravkontekst (EU/EØS-knappen)
    OG SED P2100 er journalført i Joark
    OG saksbehandler åpner startskjermbildet i EP
    Så vises det pågående P_BUC_02 hvor Norge er deltaker
    OG saksbehandler kan legge inn avdødes fnr/dnr ved bestilling av SED
    Slik at saksbehandler kan behandle pågående P_BUC_02 uten at et vedtak er fattet i Pesys.

  */
  it('EP-899 Scenario 5: Oversikt over pågående P_BUC_02 - bruker kravkontekst eller brukeroversikten) - Norge er deltaker', () => {
    stageSelector(defaultSelector, {
      pesysContext: BRUKERKONTEKST
    })
    wrapper = render(<BUCList {...initialMockProps} />)

    //expect(wrapper.exists(BUCListDiv)).toBeTruthy()    //Disabled, as BUCListDiv does no longer exist in BUCList
    //expect(wrapper.find(BucLenkePanel).length).toEqual(1)    //Disabled, as BucLenkePanel does no longer exist in BUCList
    expect(screen.getByTestId('a_buc_c_BUCHeader--P_BUC_02-NorwayIsNOTCaseOwner\']')).toBeInTheDocument()
  })
})
