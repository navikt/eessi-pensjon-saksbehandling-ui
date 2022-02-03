import { LocalStorageEntry } from 'declarations/app'
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
import CountryData from '@navikt/land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import md5 from 'md5'
import i18n from 'i18n'
import dateDecimal, { sumDates, writeFloat } from 'utils/dateDecimal'
import { FormattedDateDiff } from 'utils/dateDiff'

const getNewLand = (period: P5000Period, sender: SedSender | undefined): string | undefined => {
  if (!_.isNil(period.land) && !_.isEmpty(period.land)) {
    return period.land
  }
  return senderIsNorway(sender!) ? 'NO' : sender?.country
}

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

export const senderIsNorway = (sender: SedSender): boolean => sender?.country === 'NO' &&
  (sender?.institution !== 'NO:NAVAT06' && sender?.institution !== 'NO:NAVAT08')

export const generateKeyForListRow = (id: string, m: P5000Period): string => {
  const key = 'sedid' + id +
  '_type' + (!_.isEmpty(m.type) ? m.type : '-') +
  '_fom' + (!_.isEmpty(m.periode?.fom) ? m.periode?.fom : '-') +
  '_tom' + (!_.isEmpty(m.periode?.tom) ? m.periode?.tom : '-') +
  '_aar' + (!_.isEmpty(m.sum?.aar) ? writeFloat(m.sum.aar!) : '-') +
  '_mnd' + (!_.isEmpty(m.sum?.maaneder) ? writeFloat(m.sum.maaneder!) : '-') +
  '_dag' + (!_.isEmpty(m.sum?.dager?.nr) ? writeFloat(m.sum.dager.nr!) : '-') +
  '_yt' + (!_.isEmpty(m.relevans) ? m.relevans : '-') +
  '_ord' + (!_.isEmpty(m.ordning) ? m.ordning : '-') +
  '_ber' + (!_.isEmpty(m.beregning) ? m.beregning : '-')
  // console.log(key)
  return md5(key)
}

// Converts P5000 SED from Rina/storage into P5000 Overview / P5000 Edit table rows
export const convertP5000SEDToP5000ListRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: LocalStorageEntry<P5000SED> | undefined,
  mergePeriods: boolean,
  mergePeriodTypes ?: Array<string>
): [P5000ListRows, P5000SourceStatus] => {
  let rows: P5000ListRows = []
  let sourceStatus: P5000SourceStatus = 'rina'

  seds.forEach(sed => {
    const sender: SedSender | undefined = getSedSender(sed)
    if (context === 'overview' || (context === 'edit' && (p5000FromStorage === undefined || p5000FromStorage.sedId !== sed.id))) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }

    const mustCheckStatus: boolean = sourceStatus === 'storage'
    const rinaPeriods: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = p5000FromStorage?.content?.pensjon?.medlemskapboarbeid?.medlemskap
    const periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods

    periods?.forEach((period: P5000Period) => {
      if (!_.isNil(period)) {
        let status: P5000PeriodStatus = 'rina'
        if (mustCheckStatus) {
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

        const convertedDate = dateDecimal({
          days: period.sum?.dager?.nr,
          trimesters: period.sum?.kvartal,
          months: period.sum?.maaneder,
          weeks: period.sum?.uker,
          years: period.sum?.aar
        }, true)

        rows.push({
          key: period.key ?? generateKeyForListRow(sed.id, period),
          selected: period.selected,
          flagIkon: period.flagIkon,
          flag: period.flag,
          selectDisabled: !_.isNil(period.type) && ['11', '12', '13', '30', '41', '45', '52'].indexOf(period.type) < 0,
          selectLabel: period.flagIkon ? 'UFT periode' : i18n.t('p5000:checkbox-text'),
          status,
          land: getNewLand(period, sender),
          acronym: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym,
          type: period.type ?? '',
          startdato: period.periode?.fom ? moment(period.periode?.fom, 'YYYY-MM-DD').toDate() : '',
          sluttdato: period.periode?.tom ? moment(period.periode?.tom, 'YYYY-MM-DD').toDate() : '',
          aar: convertedDate.years,
          mnd: convertedDate.months,
          dag: convertedDate.days,
          dagtype: period.sum?.dager?.type ?? '7',
          ytelse: period.relevans ?? '',
          ordning: period.ordning ?? '',
          beregning: period.beregning ?? ''
        } as P5000ListRow)
      }
    })
  })

  if (mergePeriods) {
    const mergingMap: any = {}
    const groupedPeriods: any = {}

    // 1. group periods on an auxiliary map with `$acronym-$type-$ytelse-$ordning-$beregning` keys
    rows.forEach(r => {
      // for types that should be grouped as similar, use the same type key
      let typeNeedle = r.type
      if (!_.isEmpty(mergePeriodTypes) && mergePeriodTypes!.indexOf(r.type) >= 0) {
        typeNeedle = mergePeriodTypes!.join(':')
      }

      const key = r.acronym + '_' + typeNeedle + '_' + r.ytelse + '_' + r.ordning + '_' + r.beregning
      if (!mergingMap[key]) {
        mergingMap[key] = [r]
      } else {
        mergingMap[key].push(r)
        // sort grouped periods by start date, for easy merging
        mergingMap[key] = mergingMap[key].sort((a: P5000ListRow, b: P5000ListRow) => moment(a.startdato).isSameOrBefore(b.startdato) ? -1 : 1)
      }
    })

    // reset rows. They will be Refill on #3
    rows = []

    /** for period table:
     *     key    type      startdato  sluttdato
     *      01     01        1970        1971
     *      02     01        1971        1972
     *      03     01        1980        1981
     *      04     01        1981        1982
     *      05     01        1990        1991
     *
     *   groupedPeriods will be like this: {
     *     '01' : {
     *       '01': {
     *         parent: {first row merged with second},
     *         sub: [{first row}, {second row}]
     *       },
     *       '03' : {
     *         parent: {third row merged with fourth},
     *         sub: [{third row}, {fourth row}]
     *       },
     *       '05': {
     *         parent: {fifth row},
     *         sub: [{fifth row}]
     *       }
     *     }
     *   }
     **/

    // 3. array-walk periods, build the groupedPeriods map with merged periods
    Object.keys(mergingMap).forEach(key => {
      groupedPeriods[key] = {}

      const subRows: Array<P5000ListRow> = _.cloneDeep(mergingMap[key])
      subRows.forEach((subRow: P5000ListRow) => {
        const parentRows: Array<P5000ListRow> = Object.values(groupedPeriods[key]).map((v: any) => v.parent)
        const _subRow = _.cloneDeep(subRow)

        let parentRow
        const targetedSluttDato: Date = moment(_subRow.startdato).subtract(1, 'day').toDate()
        if (_subRow.land !== 'DE') {
          parentRow = _.find(parentRows, (_r) => moment(_r.sluttdato).isSame(moment(targetedSluttDato)))
        } else {
          // for germans, merge if they have same month / year, connecting f.ex 20-07-1986 with 01-08-1986
          parentRow = _.find(parentRows, (_r) =>
            moment(_r.sluttdato).isSame(moment(targetedSluttDato), 'month') &&
            moment(_r.sluttdato).isSame(moment(targetedSluttDato), 'year')
          )
        }

        if (!_.isNil(parentRow)) {
          parentRow.sluttdato = subRow.sluttdato
          const total: FormattedDateDiff = sumDates(
            { days: subRow.dag, months: subRow.mnd, years: subRow.aar },
            { days: parentRow.dag, months: parentRow.mnd, years: parentRow.aar }
            , true)
          parentRow.dag = total.days as string
          parentRow.mnd = total.months as string
          parentRow.aar = total.years as string

          groupedPeriods[key][parentRow.key].parent = parentRow
          groupedPeriods[key][parentRow.key].sub = groupedPeriods[key][parentRow.key].sub.concat(subRow)
        } else {
          // new
          groupedPeriods[key][subRow.key] = {
            parent: _.cloneDeep(subRow), // these will be changed to reflect merge - make sure they are not connected by cloning it
            sub: [subRow]
          }
        }
      })
    })

    // #4 use groupPeriods to create a row list
    Object.keys(groupedPeriods).forEach(key => {
      Object.keys(groupedPeriods[key]).forEach(key2 => {
        if (groupedPeriods[key][key2].sub.length === 1) {
          // period without merges - just add parent as a normal row
          rows.push({
            ...groupedPeriods[key][key2].parent,
            hasSubrows: false
          })
        } else {
        // period with merges
          rows.push({
            ...groupedPeriods[key][key2].parent,
            hasSubrows: true,
            key: 'merge-' + groupedPeriods[key][key2].parent.key
          })
          groupedPeriods[key][key2].sub.forEach((v: P5000ListRow) => {
            const _v = _.cloneDeep(v)
            _v.parentKey = 'merge-' + groupedPeriods[key][key2].parent.key
            rows.push(_v)
          })
        }
      })
    })
  }
  return [rows, sourceStatus]
}

// Converts P5000 SED from Rina/storage, using the total fields, into table rows for sum
export const convertP5000SEDToP5000SumRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: LocalStorageEntry<P5000SED> | undefined
): P5000SumRows => {
  const res: P5000SumRows = []
  const data: any = {}

  seds?.forEach(sed => {
    let sourceStatus: P5000SourceStatus
    const sender = getSedSender(sed)
    if (context === 'overview' || (context === 'edit' && (
      p5000FromStorage === undefined || p5000FromStorage.sedId !== sed.id
    ))) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }
    const [res] = convertP5000SEDToP5000ListRows([sed], context, p5000FromRinaMap, p5000FromStorage, false)
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
            sec52dag: 0,
            beregning: periode.beregning
          }
        }
        if (_.isEmpty(data[periode.type].land)) {
          data[periode.type].land = getNewLand(periode, sender)
        }
        const convertedDate: FormattedDateDiff = sumDates({
          days: periode.sum?.dager?.nr,
          trimesters: periode.sum?.kvartal,
          months: periode.sum?.maaneder,
          weeks: periode.sum?.uker,
          years: periode.sum?.aar
        }, {
          years: data[periode.type].sec51aar,
          months: data[periode.type].sec51mnd,
          days: data[periode.type].sec51dag
        })

        data[periode.type].sec51aar = convertedDate.years
        data[periode.type].sec51mnd = convertedDate.months
        data[periode.type].sec51dag = convertedDate.days

        if (_.isNil(data[periode.type].beregning) && !_.isNil(periode.beregning)) {
          data[periode.type].beregning = periode.beregning
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
            sec52dag: 0,
            beregning: periode.beregning
          }
        }
        if (_.isEmpty(data[periode.type].land)) {
          data[periode.type].land = getNewLand(periode, sender)
        }

        const convertedDate = sumDates({
          days: periode.sum?.dager?.nr,
          trimesters: periode.sum?.kvartal,
          months: periode.sum?.maaneder,
          weeks: periode.sum?.uker,
          years: periode.sum?.aar
        }, {
          years: data[periode.type].sec52aar,
          months: data[periode.type].sec52mnd,
          days: data[periode.type].sec52dag
        })

        data[periode.type].sec52aar = convertedDate.years
        data[periode.type].sec52mnd = convertedDate.months
        data[periode.type].sec52dag = convertedDate.days

        if (_.isNil(data[periode.type].beregning) && !_.isNil(periode.beregning)) {
          data[periode.type].beregning = periode.beregning
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
    flag: item.flag,
    flagIkon: item.flagIkon,
    relevans: item.ytelse,
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
  if (_.isEmpty(period.key)) {
    period.key = generateKeyForListRow(sedid, period)
  }
  return period
}

export const sumItemtoPeriod = (item: P5000SumRow): [P5000Period, P5000Period] => {
  const medlemskapTotalperiod: P5000Period = {
    key: item?.key,
    relevans: null,
    ordning: null,
    land: item.land ?? 'NO',
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
    beregning: item.beregning,
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
    land: item.land ?? 'NO',
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
    beregning: item.beregning,
    periode: {
      fom: convertDate(item.startdato),
      tom: convertDate(item.sluttdato)
    }
  }
  medlemskapTrygdetid.key = generateKeyForListRow('sum', medlemskapTrygdetid)

  return [medlemskapTotalperiod, medlemskapTrygdetid]
}

export const mergeToExistingPeriod = (arr: Array<P5000Period>, index: number, item: P5000ListRow, max40 = false) => {
  const existingDates = dateDecimal({
    years: arr[index].sum?.aar,
    trimesters: arr[index].sum?.kvartal,
    months: arr[index].sum?.maaneder,
    weeks: arr[index].sum?.uker,
    days: arr[index].sum?.dager?.nr
  })

  let newDates = sumDates({
    years: item.aar,
    months: item.mnd,
    days: item.dag
  }, existingDates)

  if (max40 && newDates.years! >= 40) {
    newDates = {
      years: 40,
      months: 0,
      days: 0
    }
  }

  arr[index].sum.aar = String(newDates.years).padStart(2, '0')
  arr[index].sum.kvartal = null
  arr[index].sum.maaneder = String(newDates.months).padStart(2, '0')
  arr[index].sum.uker = null
  arr[index].sum.dager.nr = String(newDates.days).padStart(2, '0')

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

  if (_.isNil(arr[index].beregning) && !_.isNil(item.beregning)) {
    arr[index].beregning = item.beregning
  }
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
    if (item.type === '41' && item.selected) {
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
