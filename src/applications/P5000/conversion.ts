import { LocalStorageValue } from 'declarations/app'
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

export const generateKeyForListRow = (id: string, m: P5000Period): string => {
  const key = 'sedid' + id +
  '_type' + (!_.isEmpty(m.type) ? m.type : '-') +
  '_fom' + (!_.isEmpty(m.periode?.fom) ? m.periode?.fom : '-') +
  '_tom' + (!_.isEmpty(m.periode?.tom) ? m.periode?.tom : '-') +
  '_aar' + (!_.isEmpty(m.sum?.aar) ? String(parseFloat(m.sum.aar!).toFixed(2)) : '-') +
  '_mnd' + (!_.isEmpty(m.sum?.maaneder) ? String(parseFloat(m.sum.maaneder!).toFixed(2)) : '-') +
  '_dag' + (!_.isEmpty(m.sum?.dager?.nr) ? String(parseFloat(m.sum.dager.nr!).toFixed(2)) : '-') +
  '_yt' + (!_.isEmpty(m.relevans) ? m.relevans : '-') +
  '_ord' + (!_.isEmpty(m.ordning) ? m.ordning : '-') +
  '_ber' + (!_.isEmpty(m.beregning) ? m.beregning : '-')
  // console.log(key)
  return md5(key)
}

// Converts P5000 SED from Rina/storage into table rows for view/list
export const convertP5000SEDToP5000ListRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
): [P5000ListRows, P5000SourceStatus] => {
  const res: P5000ListRows = []
  let sourceStatus: P5000SourceStatus = 'rina'

  seds.forEach(sed => {
    const sender: SedSender | undefined = getSedSender(sed)
    if (context === 'overview' || (context === 'edit' && (
      p5000FromStorage === undefined || p5000FromStorage.id !== sed.id
    ))) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }

    const checkStatus: boolean = sourceStatus === 'storage'
    const rinaPeriods: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.medlemskap
    const periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods

    periods?.forEach((period: P5000Period) => {
      if (!_.isNil(period)) {
        let status: P5000PeriodStatus = 'rina'
        if (checkStatus) {
          const matchPeriodToRina: P5000Period | undefined = period.key ? _.find(rinaPeriods, { key: period.key }) : undefined
          if (matchPeriodToRina === undefined) {
            status = 'new'
          } else {
            const periodKey = generateKeyForListRow(sed.id, period)
            if (periodKey !== matchPeriodToRina.key) {
              status = 'edited'
            } else {
              status = 'rina'
            }
          }
        }

        res.push({
          key: period.key ?? generateKeyForListRow(sed.id, period),
          selected: period.selected,
          selectdisabled: period.type !== '11' && period.type !== '12' && period.type !== '13' && period.type !== '30' && period.type !== '45' && period.type !== '52',
          status: status,
          land: sender!.countryLabel ?? '',
          acronym: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym,
          type: period.type ?? '',
          startdato: period.periode?.fom ? moment(period.periode?.fom, 'YYYY-MM-DD').toDate() : '',
          sluttdato: period.periode?.tom ? moment(period.periode?.tom, 'YYYY-MM-DD').toDate() : '',
          aar: period.sum?.aar ? parseFloat(period.sum?.aar) : '',
          kvartal: period.sum?.kvartal ?? '',
          mnd: period.sum?.maaneder ? parseFloat(period.sum?.maaneder) : '',
          uker: period.sum?.uker ?? '',
          dag: period.sum?.dager?.nr ? parseFloat(period.sum?.dager?.nr) : '',
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
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
): P5000SumRows => {
  const res: P5000SumRows = []
  const data: any = {}

  seds?.forEach(sed => {
    let sourceStatus: P5000SourceStatus
    if (context === 'overview' || (context === 'edit' && (
      p5000FromStorage === undefined || p5000FromStorage.id !== sed.id
    ))) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }
    const [res] = convertP5000SEDToP5000ListRows([sed], context, p5000FromRinaMap, p5000FromStorage)
    const rinaPeriods1: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapTotal
    const rinaPeriods2: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.trygdetid
    const storagePeriods1: Array<P5000Period> | undefined = p5000FromStorage?.content.pensjon?.medlemskapTotal
    const storagePeriods2: Array<P5000Period> | undefined = p5000FromStorage?.content.pensjon?.trygdetid
    const periods1: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods1 : storagePeriods1
    const periods2: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods2 : storagePeriods2
    periods1?.forEach((periode: P5000Period) => {
      if (!_.isNil(periode) && periode.type) {
        if (_.isNil(data[periode.type])) {
          data[periode.type] = {
            key: periode.key ?? generateKeyForListRow(sed.id, periode),
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
        if (_.isEmpty(data[periode.type].land)) {
          data[periode.type].land = periode.land ?? ''
        }
        data[periode.type].sec51aar += (periode.sum?.aar ? parseFloat(periode.sum?.aar) : 0)
        data[periode.type].sec51mnd += (periode.sum?.maaneder ? parseFloat(periode.sum?.maaneder) : 0)
        data[periode.type].sec51dag += (periode.sum?.dager?.nr ? parseFloat(periode.sum?.dager?.nr) : 0)

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
            key: periode.key ?? generateKeyForListRow(sed.id, periode),
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
        if (_.isEmpty(data[periode.type].land)) {
          data[periode.type].land = periode.land ?? ''
        }
        data[periode.type].sec52aar += (periode.sum?.aar ? parseFloat(periode.sum?.aar) : 0)
        data[periode.type].sec52mnd += (periode.sum?.maaneder ? parseFloat(periode.sum?.maaneder) : 0)
        data[periode.type].sec52dag += (periode.sum?.dager?.nr ? parseFloat(periode.sum?.dager?.nr) : 0)

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
  return res
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

export const listItemtoPeriod = (item: P5000ListRow, sedid: string, max40 = false): P5000Period => {
  const over40: boolean = max40 && parseFloat(item.aar) >= 40
  const period: P5000Period = {
    key: item?.key,
    selected: item.selected,
    relevans: item.ytelse, /// ???f
    land: item.land ?? 'NO',
    sum: {
      kvartal: null,
      aar: over40 ? '40' : String(item.aar).padStart(2, '0'),
      uker: null,
      dager: {
        nr: over40 ? '00' : '' + String(item.dag).padStart(2, '0'),
        type: '7'
      },
      maaneder: over40 ? '00' : '' + String(item.mnd).padStart(2, '0')
    },
    yrke: null,
    gyldigperiode: null,
    type: item.type,
    beregning: item.beregning,
    ordning: item.ordning,
    periode: {
      fom: convertDate(item.startdato),
      tom: convertDate(item.sluttdato)
    }
  }
  if (!period.key) {
    period.key = generateKeyForListRow(sedid, period)
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
      tom: convertDate(item.sluttdato)
    }
  }
  medlemskapTotalperiod.key = generateKeyForListRow('sum', medlemskapTotalperiod)

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
      tom: convertDate(item.sluttdato)
    }
  }
  medlemskapTrygdetid.key = generateKeyForListRow('sum', medlemskapTrygdetid)

  return [medlemskapTotalperiod, medlemskapTrygdetid]
}

const countDecimals = (value: number) => {
  if (Math.floor(value) !== value) return value.toString().split('.')[1].length || 0
  return 0
}

export const mergeToExistingPeriod = (arr: Array<P5000Period>, index: number, item: P5000ListRow, max40 = false) => {
  let newAar: number = parseFloat(arr[index].sum.aar ?? '0')
  let newMaaneder: number = parseFloat(arr[index].sum.maaneder ?? '0')
  let newDager: number = parseFloat(arr[index].sum.dager.nr ?? '0')

  newAar += parseFloat(item.aar)
  newMaaneder += parseFloat(item.mnd)
  newDager += parseFloat(item.dag)

  if (newDager >= 30) {
    const extraMonths = Math.floor(newDager / 30.0)
    newDager = newDager % 30
    newMaaneder += extraMonths
  }

  if (newMaaneder >= 12) {
    const extraYears = Math.floor(newMaaneder / 12.0)
    newMaaneder = newMaaneder % 12
    newAar += extraYears
  }

  if (max40 && newAar >= 40) {
    newAar = 40
    newMaaneder = 0
    newDager = 0
  }

  arr[index].sum.aar = countDecimals(newAar) > 6 ? newAar.toFixed(6).padStart(2, '0') : String(newAar).padStart(2, '0')
  arr[index].sum.maaneder = countDecimals(newMaaneder) > 4 ? newMaaneder.toFixed(4).padStart(2, '0') : String(newMaaneder).padStart(2, '0')
  arr[index].sum.dager.nr = countDecimals(newDager) > 1 ? newDager.toFixed(1).padStart(2, '0') : String(newDager).padStart(2, '0')

  if (!arr[index].periode) {
    arr[index].periode = {
      fom: null, tom: null
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
}

// Converts table rows for view/list, into P5000 SED for storage
export const convertFromP5000ListRowsIntoP5000SED = (
  payload: P5000UpdatePayload,
  sedid: string,
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

  const allowedFor51 = (item: P5000ListRow): boolean => {
    let answer = true
    if (item.type === '45') {
      answer = false
    }
    return answer
  }

  const allowedFor52 = (item: P5000ListRow): boolean => {
    let answer = true
    if (item.type === '11' && item.selected) {
      answer = false
    }
    if (item.type === '12' && item.selected) {
      answer = false
    }
    if (item.type === '13' && item.selected) {
      answer = false
    }
    if (item.type === '30' && item.selected) {
      answer = false
    }
    if (item.type === '45' && item.selected) {
      answer = false
    }
    if (item.type === '52') {
      answer = false
    }
    return answer
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'items') && !_.isNil(payload.items)) {
    const medlemskapPeriods: Array<P5000Period> = []
    const medemskapTotalPeriods: Array<P5000Period> = []
    const gyldigperiode: Array<P5000Period> = []

    payload.items!.forEach((item) => {
      const periode: P5000Period = listItemtoPeriod(item, sedid, false)
      medlemskapPeriods.push(periode)

      if (!_.isNil(item.type)) {
        const foundInMedemskapTotalIndex: number = _.findIndex(medemskapTotalPeriods, { type: item.type })
        const foundInGyldigperiodeIndex: number = _.findIndex(gyldigperiode, { type: item.type })

        if (allowedFor51(item)) {
          if (foundInMedemskapTotalIndex === -1) {
            medemskapTotalPeriods.push(listItemtoPeriod(item, sedid, false))
          } else {
            mergeToExistingPeriod(medemskapTotalPeriods, foundInMedemskapTotalIndex, item, false)
          }
        }

        if (allowedFor52(item)) {
          if (foundInGyldigperiodeIndex === -1) {
            gyldigperiode.push(listItemtoPeriod(item, sedid, true))
          } else {
            mergeToExistingPeriod(gyldigperiode, foundInGyldigperiodeIndex, item, true)
          }
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
