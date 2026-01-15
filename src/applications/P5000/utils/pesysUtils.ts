import { P5000ListRows } from 'src/declarations/p5000'
import _ from 'lodash'
import dayjs from "dayjs";

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
      startdato: item.startdato ? dayjs(item.startdato).format('YYYY-MM-DD') : null,
      sluttdato: item.sluttdato ? dayjs(item.sluttdato).format('YYYY-MM-DD') : null
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
