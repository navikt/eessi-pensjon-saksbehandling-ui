import { LocalStorageEntry } from 'src/declarations/app'
import {
  P5000ListRow,
  P5000ListRows,
  P5000Period,
  P5000SED,
  P5000SourceStatus,
  P5000SumRows,
  P5000UpdatePayload,
  SedSender
  , P5000sFromRinaMap
} from 'src/declarations/p5000'
import { Seds } from 'src/declarations/buc'
import _ from 'lodash'
import moment from 'moment'
import i18n from 'src/i18n'
import dateDecimal, { sumDates, writeDateDiff } from 'src/utils/dateDecimal'
import dateDiff, { DateDiff, FormattedDateDiff } from 'src/utils/dateDiff'
import {
  generateKeyForListRow, getNewLand, getSedSender, listItemtoPeriod, mergeToExistingPeriod,
  periodToListItem, sumItemtoPeriod
} from './conversionUtils'
import dayjs from "dayjs";

export interface ConvertP5000SEDToP5000ListRowsProps {
  seds: Seds
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000WorkingCopy: Array<LocalStorageEntry<P5000SED>> | LocalStorageEntry<P5000SED> | undefined
  mergePeriods?: boolean
  mergePeriodTypes ?: Array<string>
  mergePeriodBeregnings ?: Array<string>
  useGermanRules ?: boolean
  selectRowsContext: 'forCertainTypesOnly' | 'forAll'
}

export const sortItems = (items: P5000ListRows): P5000ListRows => {
  // sorting should bew only between parents or children, not among parent/children
  // so, remove children, sort them aside, then inject them

  const children: any = {}
  let parents: any = []
  let newItems: any = []

  items.forEach(item => {
    if (_.isNil(item.parentKey)) {
      parents.push(item)
    } else {
      if (_.isNil(children[item.parentKey])) {
        children[item.parentKey] = [item]
      } else {
        children[item.parentKey].push(item)
      }
    }
  })
  newItems = parents.sort((a: P5000ListRow, b: P5000ListRow) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1)
  Object.keys(children).forEach(key => {
    children[key] = children[key].sort((a: P5000ListRow, b: P5000ListRow) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1)
  })
  // inject the children arrays on the right spot, then flatten
  Object.keys(children).forEach(parentKey => {
    let index = _.findIndex(newItems, ((it: P5000ListRow) => it.key === parentKey))
    if (index >= 0) {
      newItems.splice(index + 1, 0, children[parentKey])
    }
  })
  return _.flatten(newItems)
}

const mergeP5000ListRows = (
  { rows, mergePeriodTypes, mergePeriodBeregnings, useGermanRules }:
  { rows: P5000ListRows, mergePeriodTypes: Array<string> | undefined, mergePeriodBeregnings: Array<string> | undefined, useGermanRules: boolean}
) => {
  const mergingMap: any = {}
  const groupedPeriods: any = {}

  // 1. group periods within `$land-$type-$ytelse-$ordning-$beregning` keys on an auxiliary map
  rows.forEach(r => {
    // check if type is within types that should be grouped together
    let typeNeedle = r.type
    let beregningNeedle = r.beregning
    if (!_.isEmpty(mergePeriodTypes) && mergePeriodTypes!.indexOf(r.type) >= 0) {
      typeNeedle = mergePeriodTypes!.join(', ')
    }
    if (!_.isEmpty(mergePeriodBeregnings) && mergePeriodBeregnings!.indexOf(r.beregning) >= 0) {
      beregningNeedle = mergePeriodBeregnings!.join(', ')
    }

    const key = r.land + '§' + typeNeedle + '§' + r.ytelse + '§' + r.ordning + '§' + beregningNeedle
    if (!mergingMap[key]) {
      mergingMap[key] = [r]
    } else {
      mergingMap[key].push(r)
      // sort grouped periods by start date, for easy merging (periods will not overlap)
      mergingMap[key] = mergingMap[key].sort((a: P5000ListRow, b: P5000ListRow) => moment(a.startdato).isSameOrBefore(b.startdato) ? -1 : 1)
    }
  })

  // 2. reset rows. We will refill them later on #3
  rows = []

  /** groupedPeriods structore:
   *
   *  For a period table like this:
   *
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
   *         sub: [{first row}, {second row}]  <-- merged periods
   *       },
   *       '03' : {
   *         parent: {third row merged with fourth},
   *         sub: [{third row}, {fourth row}]  <-- merged periods
   *       },
   *       '05': {
   *         parent: {fifth row},
   *         sub: [{fifth row}]  <-- unmerged period
   *       }
   *     }
   *   }
   **/

  // 3. build the groupedPeriods map by going through the mergingMap periods
  Object.keys(mergingMap).forEach(key => {
    groupedPeriods[key] = {}

    const subRows: Array<P5000ListRow> = _.cloneDeep(mergingMap[key])
    subRows.forEach((subRow: P5000ListRow) => {
      // get a list of parents (or rows that will portray grouped periods / single periods)
      const parentRows: Array<P5000ListRow> = Object.values(groupedPeriods[key]).map((v: any) => v.parent)
      const _subRow = _.cloneDeep(subRow)

      // let's find a parent row that is a suitable candidate to merge this period. If not found, then it will be an unmerged period so far
      let parentRow: P5000ListRow | undefined
      if (!useGermanRules || _subRow.land !== 'DE') {
        // parentRow.sluttdato = 31.07.2000, and subRow.startdato = 01.08.2000 - diff <= 1 day, then merge...
        parentRow = _.find(parentRows, (_r) => Math.abs(moment(_subRow.startdato).diff(moment(_r.sluttdato), 'days')) <= 1)
        //  ...unless we are talking about a period that periodesum doesn't match the calculated sum

        const calculatedSubRowDateDiff = dateDiff(subRow.startdato, subRow.sluttdato)

        const calculatedSubRowPeriodeSum: FormattedDateDiff = dateDecimal({
          dateFom: dayjs(subRow.startdato).format('YYYY-MM-DD'),
          days: subRow.dag,
          months: subRow.mnd,
          years: subRow.aar
        })

        const calculatedSubRowDateDiffLogString: string = writeDateDiff(calculatedSubRowDateDiff)
        const calculatedSubRowPeriodeSumLogString: string = writeDateDiff({
          days: calculatedSubRowPeriodeSum.days,
          months: calculatedSubRowPeriodeSum.months,
          years: calculatedSubRowPeriodeSum.years
        })

        if (calculatedSubRowPeriodeSum.totalDays === undefined || calculatedSubRowDateDiff.totalDays === undefined ||
          (calculatedSubRowPeriodeSum.totalDays < calculatedSubRowDateDiff.totalDays)) {
          console.log('subrow with period ' + moment(subRow.startdato).format('DD.MM.YYYY') + '-' + moment(subRow.sluttdato).format('DD.MM.YYYY') +
            ' diverges on periode sum, ' + calculatedSubRowPeriodeSumLogString + ' < ' + calculatedSubRowDateDiffLogString + '. ' +
            'Difference in totalDays is, ' + calculatedSubRowPeriodeSum.totalDays + ' vs ' + calculatedSubRowDateDiff.totalDays)
          parentRow = undefined
          subRow.flag = true
          subRow.flagLabel = i18n.t('message:warning-periodSumIsSmallerThanRegisteredPeriod')
        } else {
          console.log('subrow with period ' + moment(subRow.startdato).format('DD.MM.YYYY') + '-' + moment(subRow.sluttdato).format('DD.MM.YYYY') +
            ' has not too small period sum, ' + calculatedSubRowPeriodeSumLogString + ' === ' + calculatedSubRowDateDiffLogString)
        }
      } else {
        // for germans, merge if they are in adjacent months, connecting f.ex 20-07-1986 with 08-08-1986
        // I can't use same as above because moment(new Date(2020, 07, 02)).diff(new Date(2020, 09, 01), 'months') = 1
        // I have to set days to 01, so that 01.12.2020 to 01.01.2021 is still merged
        parentRow = _.find(parentRows, (_r) => {
          const targetSluttdato = moment(new Date(_r.sluttdato.getTime())).set('date', 1)
          const targetStartdato = moment(new Date(_subRow.startdato.getTime())).set('date', 1)
          return Math.abs(moment(targetStartdato).diff(targetSluttdato, 'months')) <= 1
        })
      }

      if (!_.isNil(parentRow) && !parentRow.flag) {
        // found a suitable parent to be merged, therefore increase the parent's period span and recalculate the period range
        parentRow.sluttdato = subRow.sluttdato
        let total: FormattedDateDiff
        if (!useGermanRules || _subRow.land !== 'DE') {
          total = dateDiff(parentRow.startdato, parentRow.sluttdato)
        } else {
          // for germans, consider whole months for sum
          total = dateDiff(
            moment(_.cloneDeep(parentRow.startdato)).startOf('month').toDate(),
            moment(_.cloneDeep(parentRow.sluttdato)).endOf('month').toDate())
        }
        parentRow.dag = total.days === 0 ? '' : total.days as string
        parentRow.mnd = total.months === 0 ? '' : total.months as string
        parentRow.aar = total.years === 0 ? '' : total.years as string

        groupedPeriods[key][parentRow.key].parent = parentRow
        groupedPeriods[key][parentRow.key].sub = groupedPeriods[key][parentRow.key].sub.concat(subRow)
      } else {
        // unmerged period will me single for now
        groupedPeriods[key][subRow.key] = {
          parent: _.cloneDeep(subRow), // these will be changed to reflect merge - make sure they are not connected by cloning it
          sub: [subRow]
        }
      }
    })
  })

  // #4 use groupPeriods to create a row list
  Object.keys(groupedPeriods).forEach(key => {
    // let's just extract the grouped types, so we can show it in the table
    const groupedType = key.split('§')[1]
    const groupedBeregning = key.split('§')[4]

    Object.keys(groupedPeriods[key]).forEach(key2 => {
      if (groupedPeriods[key][key2].sub.length === 1) {
        // unmerged / single periods - just add the parent as a normal row
        rows.push({
          ...groupedPeriods[key][key2].parent,
          hasSubrows: false
        })
      } else {
        // merged periods - add the parent row + sub rows

        // check if merged period sum matches the subrow's sum. If not, flagg it, and use the original sumds.
        let sumDateDiff: DateDiff = { days: 0, months: 0, years: 0 }
        groupedPeriods[key][key2].sub.forEach((sub: P5000ListRow) => {
          sumDateDiff = sumDates({
            days: sub.dag,
            months: sub.mnd,
            years: sub.aar
          }, sumDateDiff)
        }, true)

        const sumDateDiffString: string = writeDateDiff(sumDateDiff)

        const parentDateDiffString: string = writeDateDiff({
          days: groupedPeriods[key][key2].parent.dag,
          months: groupedPeriods[key][key2].parent.mnd,
          years: groupedPeriods[key][key2].parent.aar
        })

        const samePeriodSum: boolean = sumDateDiffString === parentDateDiffString

        if (!samePeriodSum) {
          groupedPeriods[key][key2].parent.dag = '' + sumDateDiff.days
          groupedPeriods[key][key2].parent.mnd = '' + sumDateDiff.months
          groupedPeriods[key][key2].parent.aar = '' + sumDateDiff.years
        }

        rows.push({
          ...groupedPeriods[key][key2].parent,
          hasSubrows: true,
          type: groupedType,
          beregning: groupedBeregning,
          key: 'merge-' + groupedPeriods[key][key2].parent.key,
          flag: !samePeriodSum,
          flagIkon: "InformationSquareIcon",
          flagLabel: i18n.t('message:warning-periodDoNotMatch'),
          isMergedRow: true
        })
        groupedPeriods[key][key2].sub.forEach((v: P5000ListRow) => {
          const _v = _.cloneDeep(v)
          _v.parentKey = 'merge-' + groupedPeriods[key][key2].parent.key
          rows.push(_v)
        })
      }
    })
  })
  return rows
}

// Converts P5000 SED from Rina/storage into P5000 Overview / P5000 Edit table rows
export const convertP5000SEDToP5000ListRows = ({
  seds,
  p5000sFromRinaMap,
  p5000WorkingCopy,
  mergePeriods = false,
  mergePeriodTypes,
  mergePeriodBeregnings,
  useGermanRules = false,
  selectRowsContext
}: ConvertP5000SEDToP5000ListRowsProps): [P5000ListRows, P5000SourceStatus] => {
  let rows: P5000ListRows = []
  let sourceStatus: P5000SourceStatus = 'rina'

  seds.forEach(sed => {
    const sender: SedSender | undefined = getSedSender(sed)
    const workingCopy: LocalStorageEntry<P5000SED> | undefined = _.isNil(p5000WorkingCopy)
      ? undefined
      : !_.isArray(p5000WorkingCopy)
          ? p5000WorkingCopy
          : _.find(p5000WorkingCopy as Array<LocalStorageEntry<P5000SED>>, p => p.sedId === sed.id)

    if (p5000WorkingCopy === undefined || workingCopy?.sedId !== sed.id) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }

    const mustCheckStatus: boolean = sourceStatus === 'storage'
    const rinaPeriods: Array<P5000Period> | undefined = p5000sFromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = workingCopy?.content?.pensjon?.medlemskapboarbeid?.medlemskap
    const periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods

    rows = rows.concat(
      periods?.map((p) => periodToListItem(p, sed, sender, mustCheckStatus, rinaPeriods, selectRowsContext)) ?? []
    )
  })

  // this is for periode merging, for table overview only.
  if (mergePeriods) {
    rows = mergeP5000ListRows({ rows, mergePeriodTypes, mergePeriodBeregnings, useGermanRules })
  }
  return [sortItems(rows), sourceStatus]
}

// Converts P5000 SED from Rina/storage, using the total fields, into table rows for sum
export const convertP5000SEDToP5000SumRows = (
  seds: Seds,
  p5000sFromRinaMap: P5000sFromRinaMap,
  p5000WorkingCopy: LocalStorageEntry<P5000SED> | undefined
): P5000SumRows => {
  const res: P5000SumRows = []
  const data: any = {}

  seds?.forEach(sed => {
    let sourceStatus: P5000SourceStatus
    const sender = getSedSender(sed)
    if (p5000WorkingCopy === undefined || p5000WorkingCopy.sedId !== sed.id) {
      sourceStatus = 'rina'
    } else {
      sourceStatus = 'storage'
    }
    const [res] = convertP5000SEDToP5000ListRows({ seds: [sed], p5000sFromRinaMap, p5000WorkingCopy, selectRowsContext: 'forCertainTypesOnly' })
    const rinaPeriods1: Array<P5000Period> | undefined = p5000sFromRinaMap[sed.id]?.pensjon?.medlemskapTotal
    const rinaPeriods2: Array<P5000Period> | undefined = p5000sFromRinaMap[sed.id]?.pensjon?.trygdetid
    const storagePeriods1: Array<P5000Period> | undefined = p5000WorkingCopy?.content.pensjon?.medlemskapTotal
    const storagePeriods2: Array<P5000Period> | undefined = p5000WorkingCopy?.content.pensjon?.trygdetid
    const periods1: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods1 : storagePeriods1
    const periods2: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods2 : storagePeriods2
    periods1?.forEach((periode: P5000Period) => {
      if (!_.isNil(periode) && periode.type) {
        if (_.isNil(data[periode.type])) {
          data[periode.type] = {
            key: periode.options?.key ?? generateKeyForListRow(sed.id, periode),
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
          dateFom: periode.periode?.fom,
          dateTom: periode.periode?.tom,
          days: periode.sum?.dager?.nr,
          quarter: periode.sum?.kvartal,
          months: periode.sum?.maaneder,
          weeks: periode.sum?.uker,
          years: periode.sum?.aar
        }, {
          dateFom: periode.periode?.fom,
          dateTom: periode.periode?.tom,
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
            key: periode.options?.key ?? generateKeyForListRow(sed.id, periode),
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
          dateFom: periode.periode?.fom,
          dateTom: periode.periode?.tom,
          days: periode.sum?.dager?.nr,
          quarter: periode.sum?.kvartal,
          months: periode.sum?.maaneder,
          weeks: periode.sum?.uker,
          years: periode.sum?.aar
        }, {
          dateFom: periode.periode?.fom,
          dateTom: periode.periode?.tom,
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

  const allowedFor51 = (item: P5000ListRow): boolean => {
    let answer = true
    if (item.type === '45' && item.selected) {
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
    if (item.type === '49' && item.selected) {
      answer = false
    }
    if (item.type === '50') {
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
      const periode: P5000Period = listItemtoPeriod(item, false)
      medlemskapPeriods.push(periode)

      if (!_.isNil(item.type)) {
        const foundInMedemskapTotalIndex: number = _.findIndex(medemskapTotalPeriods, { type: item.type })
        const foundInGyldigperiodeIndex: number = _.findIndex(gyldigperiode, { type: item.type })

        if (allowedFor51(item)) {
          if (foundInMedemskapTotalIndex === -1) {
            medemskapTotalPeriods.push(listItemtoPeriod(item, false))
          } else {
            mergeToExistingPeriod(medemskapTotalPeriods, foundInMedemskapTotalIndex, item, false)
          }
        }

        if (allowedFor52(item)) {
          if (foundInGyldigperiodeIndex === -1) {
            gyldigperiode.push(listItemtoPeriod(item, true))
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
