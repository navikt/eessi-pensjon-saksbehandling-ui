import { P5000ListRows } from 'src/declarations/p5000'
import _ from 'lodash'
import moment from 'moment'

export interface P5000ForS3 {
  land: string
  acronym: string
  type: string
  startdato: string
  sluttdato: string
  aar: string
  mnd: string
  dag: string
  ytelse: string
  ordning: string
  beregning: string
  isMergedRow: boolean
}

export const convertFromP5000ListRowsIntoPesysPeriods = (
  items: P5000ListRows
): Array<P5000ForS3> => {
  return items
    .filter(item => !!item.selected)
    .map(item => ({
      ...item,
      startdato: item.startdato ? moment(item.startdato).format('YYYY-MM-DD') : null,
      sluttdato: item.sluttdato ? moment(item.sluttdato).format('YYYY-MM-DD') : null
    })
    )
    .map((it: any) => _.omit(it, [
      'key',
      'selected',
      'selectDisabled',
      'selectLabel',
      'status',
      'editDisabled'
    ])) as Array<P5000ForS3>
}
