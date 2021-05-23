import {
  P5000Context,
  P5000ListRow,
  P5000ListRows,
  P5000Period, P5000PeriodStatus,
  P5000SED, P5000SourceStatus,
  P5000SumRows,
  SedSender
} from 'declarations/p5000'
import { P5000FromRinaMap, Participant, Sed, Seds } from 'declarations/buc'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import { type } from 'applications/P5000/P5000.labels'
import { Labels } from 'declarations/app'
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

export const generateKey = (m: P5000Period): string => (
  md5('type' + m.type + 'fom' + m.periode?.fom + 'tom' + m.periode?.tom + 'aar' + m.sum?.aar +
    'mnd' + m.sum?.maaneder + 'dag' + m.sum?.dager?.nr + 'yt' + m.relevans + 'ord' + m.ordning + 'ber' + m.beregning)
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
    let checkStatus: boolean = sourceStatus === 'storage'
    const rinaPeriods: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.medlemskapboarbeid?.medlemskap
    let periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods

    periods?.forEach((period: P5000Period) => {
      if (!_.isNil(period)) {
        let status: P5000PeriodStatus = 'rina'
        if (checkStatus) {
          let matchPeriodToRina: P5000Period | undefined = period.key ? _.find(rinaPeriods,{key: period.key}) : undefined
          if (matchPeriodToRina === undefined) {
            status = 'new'
          } else {
            let periodKey = generateKey(period)
            if (periodKey !== matchPeriodToRina.key) {
              status = 'edited'
            } else {
              status = 'rina'
            }
          }
        }
        res.push({
          key: generateKey(period),
          status: status,
          land: sender!.countryLabel || '-',
          acronym: sender!.acronym.indexOf(':') > 0 ? sender!.acronym.split(':')[1] : sender!.acronym,
          type: period.type || '-',
          startdato: period.periode?.fom ? moment(period.periode?.fom, 'YYYY-MM-DD').toDate() : '-',
          sluttdato: period.periode?.tom ? moment(period.periode?.tom, 'YYYY-MM-DD').toDate() : '-',
          aar: period.sum?.aar || '-',
          kvartal: period.sum?.kvartal || '-',
          mnd: period.sum?.maaneder || '-',
          uker: period.sum?.uker || '-',
          dag: (period.sum?.dager?.nr || '-'),
          dagtype: (period.sum?.dager?.type || '-'),
          relevantForYtelse: period.relevans || '-',
          ordning: period.ordning || '-',
          informasjonOmBeregning: period.beregning || '-'
        } as P5000ListRow)
      }
    })
  })
  return [res, sourceStatus]
}

// Converts P5000 SED from Rina/storage, using the total fields, into table rows for sum
export const convertP5000SEDTotalsToP5000SumRows = (
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
  seds.forEach(sed => {
    const rinaPeriods1: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapTotal
    const rinaPeriods2: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.trygdetid
    const storagePeriods1: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.medlemskapTotal
    const storagePeriods2: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.trygdetid
    let periods1: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods1 : storagePeriods1
    let periods2: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods2 : storagePeriods2
    periods1?.forEach((m: P5000Period) => {
      if (!_.isNil(m) && m.type) {
        if (_.isNil(data[m.type])) {
          data[m.type] = {
            key: 'type-' + m.type,
            type: (type as Labels)[m.type] + ' [' + m.type + ']',
            sec51aar: 0, sec51mnd: 0, sec51dag: 0,
            sec52aar: 0, sec52mnd: 0, sec52dag: 0
          }
        }
        data[m.type].sec51aar += (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
        data[m.type].sec51mnd += (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
        data[m.type].sec51dag += (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

        if (data[m.type].sec51dag >= 30) {
          const extraMonths = Math.floor(data[m.type].sec51dag / 30)
          const remainingDays = (data[m.type].sec51dag) % 30
          data[m.type].sec51dag = remainingDays
          data[m.type].sec51mnd += extraMonths
        }
        if (data[m.type].sec51mnd >= 12) {
          const extraYears = Math.floor(data[m.type].sec51mnd / 12)
          const remainingMonths = (data[m.type].sec51mnd) % 12
          data[m.type].sec51mnd = remainingMonths
          data[m.type].sec51aar += extraYears
        }

      }
    })
    periods2?.forEach((m: P5000Period) => {
      if (!_.isNil(m) && m.type) {
        if (!Object.prototype.hasOwnProperty.call(data, m.type)) {
          data[m.type] = {
            key: 'type-' + m.type,
            type: (type as Labels)[m.type] + ' [' + m.type + ']',
            sec51aar: 0, sec51mnd: 0, sec51dag: 0,
            sec52aar: 0, sec52mnd: 0, sec52dag: 0
          }
        }
        data[m.type].sec52aar += (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
        data[m.type].sec52mnd += (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
        data[m.type].sec52dag += (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

        if (data[m.type].sec52dag >= 30) {
          const extraMonths = Math.floor(data[m.type].sec52dag / 30)
          const remainingDays = (data[m.type].sec52dag) % 30
          data[m.type].sec52dag = remainingDays
          data[m.type].sec52mnd += extraMonths
        }
        if (data[m.type].sec52mnd >= 12) {
          const extraYears = Math.floor(data[m.type].sec52mnd / 12)
          const remainingMonths = (data[m.type].sec52mnd) % 12
          data[m.type].sec52mnd = remainingMonths
          data[m.type].sec52aar += extraYears
        }
      }
    })
  })
  Object.keys(data).sort(
    (a, b) => (parseInt(a, 10) - parseInt(b, 10))
  ).forEach((type: string) => res.push(data[type]))
  return [res, sourceStatus]
}

// Converts P5000 SED from Rina/storage, using the periods (not total fields), into table rows for sum
export const convertP5000SEDPeriodsToP5000SumRows = (
  seds: Seds,
  context: P5000Context,
  p5000FromRinaMap: P5000FromRinaMap,
  p5000FromStorage: P5000SED | undefined
): [P5000SumRows, P5000SourceStatus] => {
  const res: P5000SumRows = []
  const data: any = {}
  let sourceStatus: P5000SourceStatus
  if (context === 'overview' || (context === 'edit' && p5000FromStorage === undefined)) {
    sourceStatus = 'rina'
  } else {
    sourceStatus = 'storage'
  }

  seds.forEach(sed => {
    const rinaPeriods: Array<P5000Period> | undefined = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapboarbeid?.medlemskap
    const storagePeriods: Array<P5000Period> | undefined = p5000FromStorage?.pensjon?.medlemskapboarbeid?.medlemskap
    let periods: Array<P5000Period> | undefined = sourceStatus === 'rina' ? rinaPeriods : storagePeriods
    periods?.forEach((m: P5000Period) => {
      if (!_.isNil(m) && m.type) {
        if (!Object.prototype.hasOwnProperty.call(data, m.type)) {
          data[m.type] = {
            key: 'type-' + m.type,
            type: (type as Labels)[m.type] + ' [' + m.type + ']',
            sec51aar: 0, sec51mnd: 0, sec51dag: 0,
            sec52aar: 0, sec52mnd: 0, sec52dag: 0
          }
        }
        if (m.type !== '45') {
          data[m.type].sec51aar += (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
          data[m.type].sec51mnd += (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
          data[m.type].sec51dag += (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

          if (data[m.type].sec51dag >= 30) {
            const extraMonths = Math.floor(data[m.type].sec51dag / 30)
            const remainingDays = (data[m.type].sec51dag) % 30
            data[m.type].sec51dag = remainingDays
            data[m.type].sec51mnd += extraMonths
          }
          if (data[m.type].sec51mnd >= 12) {
            const extraYears = Math.floor(data[m.type].sec51mnd / 12)
            const remainingMonths = (data[m.type].sec51mnd) % 12
            data[m.type].sec51mnd = remainingMonths
            data[m.type].sec51aar += extraYears
          }
        }

        data[m.type].sec52aar += (m.sum?.aar ? parseInt(m.sum?.aar) : 0)
        data[m.type].sec52mnd += (m.sum?.maaneder ? parseInt(m.sum?.maaneder) : 0)
        data[m.type].sec52dag += (m.sum?.dager?.nr ? parseInt(m.sum?.dager?.nr) : 0)

        if (data[m.type].sec52dag >= 30) {
          const extraMonths = Math.floor(data[m.type].sec52dag / 30)
          const remainingDays = (data[m.type].sec52dag) % 30
          data[m.type].sec52dag = remainingDays
          data[m.type].sec52mnd += extraMonths
        }
        if (data[m.type].sec52mnd >= 12) {
          const extraYears = Math.floor(data[m.type].sec52mnd / 12)
          const remainingMonths = (data[m.type].sec52mnd) % 12
          data[m.type].sec52mnd = remainingMonths
          data[m.type].sec52aar += extraYears
        }
      }
    })
  })
  Object.keys(data).sort(
    (a, b) => (parseInt(a, 10) - parseInt(b, 10))
  ).forEach((type: string) => res.push(data[type]))
  return [res, sourceStatus]
}

// Converts table rows for view/list, into P5000 SED for storage
export const convertFromP5000ListRowsIntoP5000SED = (
  items: P5000ListRows,
  oldP5000Sed: P5000SED
): P5000SED => {

  const newP5000Sed = _.cloneDeep(oldP5000Sed)
  /*if (_.isNil(newP5000Sed.pensjon)) {
    newP5000Sed.pensjon = {}
  }
  if (_.isNil(newP5000Sed.pensjon.medlemskapboarbeid)) {
    newP5000Sed.pensjon.medlemskapboarbeid = {}
  }*/

//  items.forEach((it) => {


    // TODO
  //})

  return newP5000Sed

  /*
   newp5000FromRina.pensjon.medlemskapboarbeid.medlemskap = _items?.map(item => {
          const medlemskap: any = {}
          medlemskap.relevans = item.ytelse /// ???
          medlemskap.ordning = item.ordning
          medlemskap.land = 'NO'
          medlemskap.sum = {
            kvaltal: null,
            aar: '' + item.aar,
            uker: null,
            dager: {
              nr: '' + item.dag,
              type: '7'
            },
            maaneder: '' + item.mnd
          }
          medlemskap.yrke = null
          medlemskap.gyldigperiode = null
          medlemskap.type = item.type
          medlemskap.beregning = item.beregning
          if (!_.isNil(item.startdato) && !_.isNil(item.sluttdato)) {
            medlemskap.periode = {
              fom: moment(item.startdato, 'DD.MM.YYYY').format('YYYY-MM-DD'),
              tom: moment(item.sluttdato, 'DD.MM.YYYY').format('YYYY-MM-DD')
            }
          }
          return medlemskap
        })
        newp5000FromRina.pensjon.medlemskapboarbeid.gyldigperiode = _forsikringElklerBosetningsperioder
        newp5000FromRina.pensjon.medlemskapboarbeid.enkeltkrav = {
          krav: _ytelseOption
        }

        newp5000FromRina.pensjon.medlemskapTotal = sumItems(_items)?.map(item => {
          const medlemskap: any = {}
          medlemskap.relevans = item.ytelse /// ???
          medlemskap.ordning = item.ordning
          medlemskap.land = 'NO'
          medlemskap.sum = {
            kvaltal: null,
            aar: '' + item.aar,
            uker: null,
            dager: {
              nr: '' + item.dag,
              type: '7'
            },
            maaneder: '' + item.mnd
          }
          medlemskap.yrke = null
          medlemskap.gyldigperiode = null
          medlemskap.type = item.type
          medlemskap.beregning = item.beregning
          if (!_.isNil(item.startdato) && !_.isNil(item.sluttdato)) {
            medlemskap.periode = {
              fom: moment(item.startdato, 'DD.MM.YYYY').format('YYYY-MM-DD'),
              tom: moment(item.sluttdato, 'DD.MM.YYYY').format('YYYY-MM-DD')
            }
          }
          return medlemskap
        })
        newp5000FromRina.pensjon.medlemskapTotal.gyldigperiode = _forsikringElklerBosetningsperioder
        newp5000FromRina.pensjon.medlemskapTotal.enkeltkrav = {
          krav: _ytelseOption
        }

        newp5000FromRina.pensjon.trygdetid = sumItemsForTrygdetid(_items)?.map(item => {
          const medlemskap: any = {}
          medlemskap.relevans = item.ytelse /// ???
          medlemskap.ordning = item.ordning
          medlemskap.land = 'NO'
          medlemskap.sum = {
            kvaltal: null,
            aar: '' + item.aar,
            uker: null,
            dager: {
              nr: '' + item.dag,
              type: '7'
            },
            maaneder: '' + item.mnd
          }
          medlemskap.yrke = null
          medlemskap.gyldigperiode = null
          medlemskap.type = item.type
          medlemskap.beregning = item.beregning
          if (!_.isNil(item.startdato) && !_.isNil(item.sluttdato)) {
            medlemskap.periode = {
              fom: moment(item.startdato, 'DD.MM.YYYY').format('YYYY-MM-DD'),
              tom: moment(item.sluttdato, 'DD.MM.YYYY').format('YYYY-MM-DD')
            }
          }
          return medlemskap
        })
        newp5000FromRina.pensjon.trygdetid.gyldigperiode = _forsikringElklerBosetningsperioder
        newp5000FromRina.pensjon.trygdetid.enkeltkrav = {
          krav: _ytelseOption
        }

   */

 /* const sumItems = (items: P5000EditRows = []): P5000EditRows => {
    const res: P5000EditRows = []
    items.forEach((it) => {
      if (it.type) {
        const found: number = _.findIndex(res, d => d.type === it.type)
        if (found === -1) {
          res.push({
            ...it,
            key: 'sum-' + it.type + '-' + it.startdato + '-' + it.sluttdato
          })
        } else {
          res[found].aar += it.aar
          res[found].mnd += it.mnd
          res[found].dag += it.dag
          res[found].startdato = moment(it.startdato, 'DD.MM.YYYY').isSameOrBefore(moment(res[found].startdato, 'DD.MM.YYYY')) ? it.startdato : res[found].startdato
          res[found].sluttdato = moment(it.sluttdato, 'DD.MM.YYYY').isSameOrAfter(moment(res[found].sluttdato, 'DD.MM.YYYY')) ? it.sluttdato : res[found].sluttdato
          res[found].key = 'sum-' + res[found].type + '-' + res[found].startdato + '-' + res[found].sluttdato
          if ((res[found].dag) >= 30) {
            const extraMonths = Math.floor(res[found].dag / 30)
            const remainingDays = (res[found].dag) % 30
            res[found].dag = remainingDays
            res[found].mnd += extraMonths
          }
          if ((res[found].mnd) >= 12) {
            const extraYears = Math.floor(res[found].mnd / 12)
            const remainingMonths = (res[found].mnd) % 12
            res[found].mnd = remainingMonths
            res[found].aar += extraYears
          }
        }
      }
    })
    return res
  }

  const sumItemsForTrygdetid = (items: P5000EditRows = []): P5000EditRows => {
    const res: P5000EditRows = []
    items.forEach((it) => {
      if (it.type && it.type !== '45') {
        const found: number = _.findIndex(res, d => d.type === it.type)
        if (found === -1) {
          res.push({
            ...it,
            key: 'sum-' + it.type + '-' + it.startdato + '-' + it.sluttdato
          })
        } else {
          res[found].aar += it.aar
          res[found].mnd += it.mnd
          res[found].dag += it.dag
          res[found].startdato = moment(it.startdato, 'DD.MM.YYYY').isSameOrBefore(moment(res[found].startdato, 'DD.MM.YYYY')) ? it.startdato : res[found].startdato
          res[found].sluttdato = moment(it.sluttdato, 'DD.MM.YYYY').isSameOrAfter(moment(res[found].sluttdato, 'DD.MM.YYYY')) ? it.sluttdato : res[found].sluttdato
          res[found].key = 'sum-' + res[found].type + '-' + res[found].startdato + '-' + res[found].sluttdato
          if ((res[found].dag) >= 30) {
            const extraMonths = Math.floor(res[found].dag / 30)
            const remainingDays = (res[found].dag) % 30
            res[found].dag = remainingDays
            res[found].mnd += extraMonths
          }
          if ((res[found].mnd) >= 12) {
            const extraYears = Math.floor(res[found].mnd / 12)
            const remainingMonths = (res[found].mnd) % 12
            res[found].mnd = remainingMonths
            res[found].aar += extraYears
          }
        }
      }
    })
    return res
  }*/

}
