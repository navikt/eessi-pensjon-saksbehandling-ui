import {
  P5000Context,
  P5000ListRow,
  P5000ListRows,
  P5000Period, P5000PeriodStatus,
  P5000SED, P5000SourceStatus,
  P5000SumRow,
  P5000SumRows, P5000UpdatePayload,
  SedSender
} from 'declarations/p5000'
import { P5000FromRinaMap, Participant, Sed, Seds } from 'declarations/buc'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import md5 from 'md5'

export const getSedSender = (sed: Sed | undefined): SedSender | undefined => {
  if (sed === undefined) {
    return undefined
  }
  const sender: Participant | undefined = sed.participants?.find((participant: Participant) => participant.role === 'Sender')
  if (!sender) {
    return undefined
  }
  return {
    date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
    countryLabel: CountryData.getCountryInstance('nb').findByValue(sender.organisation.countryCode).label,
    country: sender.organisation.countryCode,
    institution: sender.organisation.name,
    acronym: sender.organisation.acronym || '-'
  }
}

export const generateKeyForListRow = (m: P5000Period): string => (
  md5(
    'type' + (m.type ?? '') + 'fom' + (m.periode?.fom ?? '') + 'tom' + (m.periode?.tom ?? '') +
    'aar' + (m.sum?.aar ?? '') + 'mnd' + (m.sum?.maaneder ?? '') +
    'dag' + (m.sum?.dager?.nr ?? '') +
    'yt' + (m.relevans ?? '') + 'ord' + (m.ordning ?? '') + 'ber' + (m.beregning ?? '')
  )
)

// Converts P5000 SED from Rina/storage into table rows for view/list
export const convertP5000SEDToP5000ListRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: P5000SED | undefined
): [P5000ListRows, P5000SourceStatus] => {
  const res: P5000ListRows = []
  let sourceStatus: P5000SourceStatus
  if (context === 'overview' || (context === 'edit' && p5000FromStorage === undefined)) {
    sourceStatus = 'rina'
  } else {
    sourceStatus = 'storage'
  }

  seds.forEach(sed => {
    const sender: SedSender | undefined = getSedSender(sed)
    const checkStatus: boolean = sourceStatus === 'storage'
    const rinaPeriods: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.medlemskapboarbeid?.medlemskap
    const periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods

    periods?.forEach((period: P5000Period) => {
      if (!_.isNil(period)) {
        let status: P5000PeriodStatus = 'rina'
        if (checkStatus) {
          const matchPeriodToRina: P5000Period | undefined = period.key ? _.find(rinaPeriods, { key: period.key }) : undefined
          if (matchPeriodToRina === undefined) {
            status = 'new'
          } else {
            const periodKey = generateKeyForListRow(period)
            if (periodKey !== matchPeriodToRina.key) {
              status = 'edited'
            } else {
              status = 'rina'
            }
          }
        }

        res.push({
          key: period.key ?? generateKeyForListRow(period),
          status: status,
          land: sender!.countryLabel ?? '',
          acronym: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym,
          type: period.type ?? '',
          startdato: period.periode?.fom ? moment(period.periode?.fom, 'YYYY-MM-DD').toDate() : '',
          sluttdato: period.periode?.tom ? moment(period.periode?.tom, 'YYYY-MM-DD').toDate() : '',
          aar: period.sum?.aar ? parseInt(period.sum?.aar) : '',
          kvartal: period.sum?.kvartal ?? '',
          mnd: period.sum?.maaneder ? parseInt(period.sum?.maaneder) : '',
          uker: period.sum?.uker ?? '',
          dag: period.sum?.dager?.nr ? parseInt(period.sum?.dager?.nr) : '',
          dagtype: period.sum?.dager?.type ?? '',
          ytelse: period.relevans ?? '',
          ordning: period.ordning ?? '',
          beregning: period.beregning ?? ''
        } as P5000ListRow)
      }
    })
  })
  return [res, sourceStatus]
}

// Converts P5000 SED from Rina/storage, using the total fields, into table rows for sum
export const convertP5000SEDToP5000SumRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: P5000SED | undefined
): [P5000SumRows, P5000SourceStatus] => {
  const res: P5000SumRows = []
  let sourceStatus: P5000SourceStatus
  if (context === 'overview' || (context === 'edit' && p5000FromStorage === undefined)) {
    sourceStatus = 'rina'
  } else {
    sourceStatus = 'storage'
  }
  const data: any = {}
  seds?.forEach(sed => {
    const [res] = convertP5000SEDToP5000ListRows([sed], context, p5000FromRinaMap, p5000FromStorage)
    const rinaPeriods1: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapTotal
    const rinaPeriods2: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.trygdetid
    const storagePeriods1: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.medlemskapTotal
    const storagePeriods2: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.trygdetid
    const periods1: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods1 : storagePeriods1
    const periods2: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods2 : storagePeriods2
    periods1?.forEach((periode: P5000Period) => {
      if (!_.isNil(periode) && periode.type) {
        if (_.isNil(data[periode.type])) {
          data[periode.type] = {
            key: periode.key ?? generateKeyForListRow(periode),
            type: periode.type,
            land: '',
            sec51aar: 0,
            sec51mnd: 0,
            sec51dag: 0,
            sec52aar: 0,
            sec52mnd: 0,
            sec52dag: 0
          }
        }

        data[periode.type].land = periode.land ?? ''
        data[periode.type].sec51aar += (periode.sum?.aar ? parseInt(periode.sum?.aar) : 0)
        data[periode.type].sec51mnd += (periode.sum?.maaneder ? parseInt(periode.sum?.maaneder) : 0)
        data[periode.type].sec51dag += (periode.sum?.dager?.nr ? parseInt(periode.sum?.dager?.nr) : 0)

        if (data[periode.type].sec51dag >= 30) {
          const extraMonths = Math.floor(data[periode.type].sec51dag / 30)
          const remainingDays = (data[periode.type].sec51dag) % 30
          data[periode.type].sec51dag = remainingDays
          data[periode.type].sec51mnd += extraMonths
        }
        if (data[periode.type].sec51mnd >= 12) {
          const extraYears = Math.floor(data[periode.type].sec51mnd / 12)
          const remainingMonths = (data[periode.type].sec51mnd) % 12
          data[periode.type].sec51mnd = remainingMonths
          data[periode.type].sec51aar += extraYears
        }
      }
    })
    periods2?.forEach((periode: P5000Period) => {
      if (!_.isNil(periode) && periode.type) {
        if (!Object.prototype.hasOwnProperty.call(data, periode.type)) {
          data[periode.type] = {
            key: periode.key ?? generateKeyForListRow(periode),
            status: 'rina',
            type: periode.type,
            land: '',
            sec51aar: 0,
            sec51mnd: 0,
            sec51dag: 0,
            sec52aar: 0,
            sec52mnd: 0,
            sec52dag: 0
          }
        }
        data[periode.type].land = periode.land ?? ''
        data[periode.type].sec52aar += (periode.sum?.aar ? parseInt(periode.sum?.aar) : 0)
        data[periode.type].sec52mnd += (periode.sum?.maaneder ? parseInt(periode.sum?.maaneder) : 0)
        data[periode.type].sec52dag += (periode.sum?.dager?.nr ? parseInt(periode.sum?.dager?.nr) : 0)

        if (data[periode.type].sec52dag >= 30) {
          const extraMonths = Math.floor(data[periode.type].sec52dag / 30)
          const remainingDays = (data[periode.type].sec52dag) % 30
          data[periode.type].sec52dag = remainingDays
          data[periode.type].sec52mnd += extraMonths
        }
        if (data[periode.type].sec52mnd >= 12) {
          const extraYears = Math.floor(data[periode.type].sec52mnd / 12)
          const remainingMonths = (data[periode.type].sec52mnd) % 12
          data[periode.type].sec52mnd = remainingMonths
          data[periode.type].sec52aar += extraYears
        }
      }
    })

    Object.keys(data).forEach(type => {
      let allnew: boolean = true
      let allrina: boolean = true
      res.forEach(r => {
        if (r.type === type) {
          if (r.status !== 'new') {
            allnew = false
          }
          if (r.status !== 'rina') {
            allrina = false
          }
        }
      })

      if (allnew) {
        data[type].status = 'new'
      }
      if (allrina) {
        data[type].status = 'rina'
      }
      if (!allrina && !allnew) {
        data[type].status = 'edited'
      }
    })
  })
  Object.keys(data).sort(
    (a, b) => (parseInt(a, 10) - parseInt(b, 10))
  )?.forEach((type: string) => res.push(data[type]))
  return [res, sourceStatus]
}

export const convertDate = (date: string | Date | null | undefined): string | null => {
  if (_.isNil(date)) {
    return null
  }
  if (_.isDate(date)) {
    return moment(date).format('YYYY-MM-DD')
  }
  return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
}

export const listItemtoPeriod = (item: P5000ListRow): P5000Period => {
  const period: P5000Period = {
    key: item?.key,
    relevans: item.ytelse, /// ???
    ordning: item.ordning,
    land: item.land || 'NO',
    sum: {
      kvartal: null,
      aar: String(item.aar).padStart(2, '0'),
      uker: null,
      dager: {
        nr: '' + String(item.dag).padStart(2, '0'),
        type: '7'
      },
      maaneder: '' + String(item.mnd).padStart(2, '0')
    },
    yrke: null,
    gyldigperiode: null,
    type: item.type,
    beregning: item.beregning,
    periode: {
      fom: convertDate(item.startdato),
      tom: convertDate(item.sluttdato),
      extra: null
    }
  }
  if (!period.key) {
    period.key = generateKeyForListRow(period)
  }
  return period
}

export const sumItemtoPeriod = (item: P5000SumRow): [P5000Period, P5000Period] => {
  const medlemskapTotalperiod: P5000Period = {
    key: item?.key,
    relevans: null,
    ordning: null,
    land: item.land || 'NO',
    sum: {
      kvartal: null,
      aar: String(item.sec51aar).padStart(2, '0'),
      uker: null,
      dager: {
        nr: '' + String(item.sec51dag).padStart(2, '0'),
        type: '7'
      },
      maaneder: '' + String(item.sec51mnd).padStart(2, '0')
    },
    yrke: null,
    gyldigperiode: null,
    type: item.type,
    beregning: null,
    periode: {
      fom: convertDate(item.startdato),
      tom: convertDate(item.sluttdato),
      extra: null
    }
  }
  medlemskapTotalperiod.key = generateKeyForListRow(medlemskapTotalperiod)

  const medlemskapTrygdetid: P5000Period = {
    key: item?.key,
    relevans: null,
    ordning: null,
    land: item.land || 'NO',
    sum: {
      kvartal: null,
      aar: String(item.sec52aar).padStart(2, '0'),
      uker: null,
      dager: {
        nr: '' + String(item.sec52dag).padStart(2, '0'),
        type: '7'
      },
      maaneder: '' + String(item.sec52mnd).padStart(2, '0')
    },
    yrke: null,
    gyldigperiode: null,
    type: item.type,
    beregning: null,
    periode: {
      fom: convertDate(item.startdato),
      tom: convertDate(item.sluttdato),
      extra: null
    }
  }
  medlemskapTrygdetid.key = generateKeyForListRow(medlemskapTrygdetid)

  return [medlemskapTotalperiod, medlemskapTrygdetid]
}

export const mergeToExistingPeriod = (arr: Array<P5000Period>, index: number, item: P5000ListRow) => {
  arr[index].sum.aar = arr[index].sum.aar !== null ? '' + (parseInt(arr[index].sum.aar!) + item.aar) : '' + item.aar
  arr[index].sum.maaneder = arr[index].sum.maaneder !== null ? '' + (parseInt(arr[index].sum.maaneder!) + item.mnd) : '' + item.mnd
  arr[index].sum.dager.nr = arr[index].sum.dager.nr !== null ? '' + (parseInt(arr[index].sum.dager.nr!) + item.dag) : '' + item.dag
  if (!arr[index].periode) {
    arr[index].periode = {
      fom: null, tom: null, extra: null
    }
  }
  arr[index].periode!.fom =
    moment(item.startdato).isSameOrBefore(moment(arr[index].periode?.fom, 'YYYY-MM-DD'))
      ? moment(item.startdato).format('YYYY-MM-DD')
      : arr[index].periode!.fom

  arr[index].periode!.tom =
    moment(item.sluttdato).isSameOrAfter(moment(arr[index].periode?.tom, 'YYYY-MM-DD'))
      ? moment(item.sluttdato).format('YYYY-MM-DD')
      : arr[index].periode!.tom
  if (arr[index].sum.dager.nr !== null && parseInt(arr[index].sum.dager.nr!) >= 30) {
    const extraMonths = Math.floor(parseInt(arr[index].sum.dager.nr!) / 30)
    const remainingDays = (parseInt(arr[index].sum.dager.nr!)) % 30
    arr[index].sum.dager.nr = '' + remainingDays
    arr[index].sum.maaneder = arr[index].sum.maaneder !== null ? '' + (parseInt(arr[index].sum.maaneder!) + extraMonths) : '' + extraMonths
  }
  if (arr[index].sum.maaneder !== null && parseInt(arr[index].sum.maaneder!) >= 12) {
    const extraYears = Math.floor(parseInt(arr[index].sum.maaneder!) / 12)
    const remainingMonths = (parseInt(arr[index].sum.maaneder!)) % 12
    arr[index].sum.maaneder = '' + remainingMonths
    arr[index].sum.aar = arr[index].sum.aar !== null ? '' + (parseInt(arr[index].sum.aar!) + extraYears) : '' + extraYears
  }

  arr[index].sum.aar = String(arr[index].sum.aar).padStart(2, '0')
  arr[index].sum.maaneder = String(arr[index].sum.maaneder).padStart(2, '0')
  arr[index].sum.dager.nr = String(arr[index].sum.dager.nr).padStart(2, '0')
}

// Converts table rows for view/list, into P5000 SED for storage
export const convertFromP5000ListRowsIntoP5000SED = (
  payload: P5000UpdatePayload,
  oldP5000Sed: P5000SED
): P5000SED => {
  const newP5000Sed = _.cloneDeep(oldP5000Sed)
  if (_.isNil(newP5000Sed.pensjon)) {
    // @ts-ignore
    newP5000Sed.pensjon = {}
  }
  if (_.isNil(newP5000Sed.pensjon.medlemskapboarbeid)) {
    // @ts-ignore
    newP5000Sed.pensjon.medlemskapboarbeid = {}
  }
  if (_.isNil(newP5000Sed.pensjon.medlemskapTotal)) {
    // @ts-ignore
    newP5000Sed.pensjon.medlemskapTotal = []
  }
  if (_.isNil(newP5000Sed.pensjon.trygdetid)) {
    // @ts-ignore
    newP5000Sed.pensjon.trygdetid = []
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'items') && !_.isNil(payload.items)) {
    const medlemskapPeriods: Array<P5000Period> = []
    const medemskapTotalPeriods: Array<P5000Period> = []
    const gyldigperiode: Array<P5000Period> = []

    payload.items!.forEach((item) => {
      const periode: P5000Period = listItemtoPeriod(item)
      medlemskapPeriods.push(periode)

      if (!_.isNil(item.type)) {
        const foundInMedemskapTotalIndex: number = _.findIndex(medemskapTotalPeriods, { type: item.type })
        const foundInGyldigperiodeIndex: number = _.findIndex(gyldigperiode, { type: item.type })

        if (item.type !== '45') {
          if (foundInMedemskapTotalIndex === -1) {
            medemskapTotalPeriods.push(listItemtoPeriod(item))
          } else {
            mergeToExistingPeriod(medemskapTotalPeriods, foundInMedemskapTotalIndex, item)
          }
        }
        if (foundInGyldigperiodeIndex === -1) {
          gyldigperiode.push(listItemtoPeriod(item))
        } else {
          mergeToExistingPeriod(gyldigperiode, foundInGyldigperiodeIndex, item)
        }
      }
    })
    newP5000Sed.pensjon.medlemskapboarbeid.medlemskap = medlemskapPeriods
    newP5000Sed.pensjon.medlemskapTotal = medemskapTotalPeriods
    newP5000Sed.pensjon.trygdetid = gyldigperiode
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'ytelseOption') && !_.isNil(payload.ytelseOption)) {
    newP5000Sed.pensjon.medlemskapboarbeid.enkeltkrav = {
      krav: payload.ytelseOption
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'forsikringEllerBosetningsperioder') && !_.isNil(payload.forsikringEllerBosetningsperioder)) {
    newP5000Sed.pensjon.medlemskapboarbeid.gyldigperiode = payload.forsikringEllerBosetningsperioder
  }

  return newP5000Sed
}

export const convertFromP5000SumRowsIntoP5000SED = (
  items: P5000SumRows,
  oldP5000Sed: P5000SED
): P5000SED => {
  const newP5000Sed = _.cloneDeep(oldP5000Sed)
  if (_.isNil(newP5000Sed.pensjon)) {
    // @ts-ignore
    newP5000Sed.pensjon = {}
  }
  if (_.isNil(newP5000Sed.pensjon.medlemskapTotal)) {
    // @ts-ignore
    newP5000Sed.pensjon.medlemskapTotal = []
  }
  if (_.isNil(newP5000Sed.pensjon.trygdetid)) {
    // @ts-ignore
    newP5000Sed.pensjon.trygdetid = []
  }

  const medemskapTotalPerioder: Array<P5000Period> = []
  const trygdetidPerioder: Array<P5000Period> = []

  items?.forEach((item) => {
    const [medemskapTotalPeriode, trygdetidPeriode] = sumItemtoPeriod(item)
    medemskapTotalPerioder.push(medemskapTotalPeriode)
    trygdetidPerioder.push(trygdetidPeriode)
  })
  newP5000Sed.pensjon.medlemskapTotal = medemskapTotalPerioder
  newP5000Sed.pensjon.trygdetid = trygdetidPerioder
  return newP5000Sed
}
