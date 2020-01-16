import { FilesPropType } from 'declarations/types.pt'
import PT from 'prop-types'

export const PeriodDatePropType = PT.shape({
  day: PT.string.isRequired,
  month: PT.string.isRequired,
  year: PT.string.isRequired
})

export const CountryPropType = PT.shape({
  label: PT.string.isRequired,
  value: PT.string.isRequired
})

export const PeriodPropType = PT.shape({
  id: PT.number,
  type: PT.string.isRequired,
  startDate: PeriodDatePropType.isRequired,
  endDate: PeriodDatePropType,
  dateType: PT.string.isRequired,
  uncertainDate: PT.bool.isRequired,
  country: CountryPropType.isRequired,
  comment: PT.string.isRequired,
  otherType: PT.string,
  insuranceName: PT.string,
  insuranceType: PT.string,
  insuranceId: PT.string,
  workActivity: PT.string,
  workName: PT.string,
  workType: PT.string,
  workStreet: PT.string,
  workCity: PT.string,
  workZipCode: PT.string,
  workRegion: PT.string,
  childFirstName: PT.string,
  childLastName: PT.string,
  childBirthDate: PeriodDatePropType,
  learnInstitution: PT.string,
  payingInstitution: PT.string,
  attachments: FilesPropType
})

export const PeriodsPropType = PT.arrayOf(PeriodPropType.isRequired)

export const PeriodErrorsPropType = PT.objectOf(PT.string)

export const PayloadPeriodPropType = PT.shape({
  land: PT.string.isRequired,
  periode: PT.shape({
    lukketPeriode: PT.shape({
      fom: PT.string,
      tom: PT.string
    }),
    openPeriode: PT.shape({
      fom: PT.string,
      extra: PT.string.isRequired
    })
  }).isRequired,
  vedlegg: FilesPropType,
  trygdeordningnavn: PT.string,
  medlemskap: PT.string,
  forsikkringEllerRegistreringNr: PT.string,
  annenInformasjon: PT.string,
  usikkerDatoIndikator: PT.string,
  jobbUnderAnsattEllerSelvstendig: PT.string,
  navnFirma: PT.string,
  typePeriode: PT.string,
  adresseFirma: PT.shape({
    postnummer: PT.string,
    by: PT.string,
    land: PT.string,
    gate: PT.string,
    region: PT.string
  }),
  navnPaaInstitusjon: PT.string,
  informasjonBarn: PT.shape({
    etternavn: PT.string,
    fornavn: PT.string,
    foedseldato: PT.string,
    land: PT.string
  })
})

export const PayloadPeriodsPropType = PT.arrayOf(PayloadPeriodPropType)

export const PayloadPropType = PT.shape({
  ansattSelvstendigPerioder: PayloadPeriodsPropType,
  boPerioder: PayloadPeriodsPropType,
  barnepassPerioder: PayloadPeriodsPropType,
  frivilligPerioder: PayloadPeriodsPropType,
  forsvartjenestePerioder: PayloadPeriodsPropType,
  foedselspermisjonPerioder: PayloadPeriodsPropType,
  opplaeringPerioder: PayloadPeriodsPropType,
  arbeidsledigPerioder: PayloadPeriodsPropType,
  sykePerioder: PayloadPeriodsPropType,
  andrePerioder: PayloadPeriodsPropType
})

export const StayAbroadPropType = PT.arrayOf(PeriodPropType.isRequired)

export const PersonPropType = PT.object

export const BankPropType = PT.object

export const P4000InfoPropType = PT.shape({
  person: PersonPropType.isRequired,
  bank: BankPropType.isRequired,
  stayAbroad: StayAbroadPropType.isRequired
})

export const P4000PayloadInfoPropType = PT.shape({
  personInfo: PersonPropType.isRequired,
  bankInfo: BankPropType.isRequired,
  periodeInfo: PayloadPeriodsPropType.isRequired
})
