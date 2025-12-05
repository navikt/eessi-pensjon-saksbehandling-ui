import CountryData from '@navikt/land-verktoy'
import { Participant, Sed } from 'src/declarations/buc'
import { P5000ListRow, P5000Period, P5000PeriodStatus, P5000SumRow, SedSender } from 'src/declarations/p5000'
import i18n from 'src/i18n'
import _ from 'lodash'
import md5 from 'md5'
import moment from 'moment'
import dateDecimal, { sumDates, writeFloat } from 'src/utils/dateDecimal'

export const getNewLand = (period: P5000Period, sender: SedSender | undefined): string | undefined => {
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

const senderIsNorway = (sender: SedSender): boolean => sender?.country === 'NO'
  // Used for simulating sending to/from Norway to/from DK/FI (Q2-->Q1/Q1-->Q2)
  //&& (sender?.institution !== 'NO:NAVAT06' && sender?.institution !== 'NO:NAVAT08')

export const generateKeyForListRow = (id: string, m: P5000Period): string => {
  if(m){
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
  } else {
    return md5('sedid' + id)
  }

}

const convertDate = (date: string | Date | null | undefined): string | null => {
  if (_.isNil(date)) {
    return null
  }
  if (_.isDate(date)) {
    return moment(date).format('YYYY-MM-DD')
  }
  return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
}

export const periodToListItem = (
  period: P5000Period, sed: Sed, sender: SedSender | undefined, mustCheckStatus: boolean,
  rinaPeriods: Array<P5000Period> | undefined, selectRowsContext: any
): P5000ListRow => {
  let status: P5000PeriodStatus = 'rina'
  if (mustCheckStatus) {
    const matchPeriodToRina: P5000Period | undefined = _.has(period, 'options.key') ? _.find(rinaPeriods, p => p.options?.key === period.options!.key) : undefined
    if (matchPeriodToRina === undefined) {
      status = 'new'
    } else {
      const periodKey = generateKeyForListRow(sed.id, period)
      if (periodKey !== matchPeriodToRina.options?.key) {
        status = 'edited'
      } else {
        status = 'rina'
      }
    }
  }

  const convertedDate = dateDecimal({
    dateFom: period.periode?.fom,
    dateTom: period.periode?.tom,
    days: period.sum?.dager?.nr,
    quarter: period.sum?.kvartal,
    months: period.sum?.maaneder,
    weeks: period.sum?.uker,
    years: period.sum?.aar
  }, true)

  return {
    key: period.options?.key ?? generateKeyForListRow(sed.id, period),
    selected: period.options?.selected,
    flagIkon: period.options?.flagIkon,
    flag: period.options?.flag,
    selectDisabled: selectRowsContext === 'forCertainTypesOnly'
      ? !_.isNil(period.type) && ['11', '12', '13', '30', '41', '45', '52'].indexOf(period.type) < 0
      : false,
    selectLabel: !period.options?.flagIkon
      ? selectRowsContext === 'forCertainTypesOnly'
          ? i18n.t('p5000:checkbox-text-for-edit')
          : i18n.t('p5000:checkbox-text-for-pesys')
      : period.options?.flagIkon === 'UFT'
        ? 'Uføretrygd periode'
        : 'Gjenlevendeytelse / Barnepensjon periode',
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
  } as P5000ListRow
}

export const listItemtoPeriod = (item: P5000ListRow, max40 = false): P5000Period => {
  const over40: boolean = max40 && parseFloat(item.aar) >= 40

  const period: P5000Period = {
    options: {
      key: item?.key,
      selected: item.selected,
      flag: item.flag,
      flagIkon: item.flagIkon,
      sedId: item.sedId
    },
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
  if (_.isEmpty(period.options!.key)) {
    period.options!.key = generateKeyForListRow(item.sedId, period)
  }
  return period
}

export const sumItemtoPeriod = (item: P5000SumRow): [P5000Period, P5000Period] => {
  const medlemskapTotalperiod: P5000Period = {
    options: {
      key: item?.key
    },
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
  medlemskapTotalperiod.options!.key = generateKeyForListRow('sum', medlemskapTotalperiod)

  const medlemskapTrygdetid: P5000Period = {
    options: {
      key: item?.key
    },
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
  medlemskapTrygdetid.options!.key = generateKeyForListRow('sum', medlemskapTrygdetid)

  return [medlemskapTotalperiod, medlemskapTrygdetid]
}

export const mergeToExistingPeriod = (arr: Array<P5000Period>, index: number, item: P5000ListRow, max40 = false) => {
  console.log('mergeToExistingPeriod - index:', index, ' item:', item)
  const existingDates = dateDecimal({
    dateFom: arr[index].periode?.fom,
    dateTom: arr[index].periode?.tom,
    years: arr[index].sum?.aar,
    quarter: arr[index].sum?.kvartal,
    months: arr[index].sum?.maaneder,
    weeks: arr[index].sum?.uker,
    days: arr[index].sum?.dager?.nr
  })

  let newDates = sumDates({
    years: item.aar,
    months: item.mnd,
    days: item.dag
  }, existingDates)

  if (max40 && (_.isNumber(newDates.years!) ? newDates.years! >= 40 : parseInt(newDates.years!) >= 40)) {
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
