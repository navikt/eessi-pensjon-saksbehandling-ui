import * as BUCUtils from './BUCUtils'
import Mustache from 'mustache'

describe('applications/BUC/components/BUCUtils/BUCUtils', () => {
  const t = jest.fn((label, vars) => Mustache.render(label, vars))

  it('getBucTypeLabel()', () => {
    expect(BUCUtils.getBucTypeLabel({
      type: 'P2000',
      locale: 'nb',
      t: t
    })).toEqual('buc:buc-P2000')

    expect(BUCUtils.getBucTypeLabel({
      type: 'P3000_NO',
      locale: 'nb',
      t: t
    })).toEqual('buc:buc-P3000_XX')
  })

  it('sedSorter', () => {
    const CORRECT_ORDER = -1
    const WRONG_ORDER_WILL_SWAP = 1
    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 2), type: 'P1000' },
      { lastUpdate: new Date(2010, 1, 1), type: 'P1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 1), type: 'P1000' },
      { lastUpdate: new Date(2010, 1, 2), type: 'P1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 1), type: 'P1000' },
      { lastUpdate: new Date(2010, 1, 1), type: 'P2000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 1), type: 'P10000' },
      { lastUpdate: new Date(2010, 1, 1), type: 'P2000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 1), type: 'P1000' },
      { lastUpdate: new Date(2010, 1, 1), type: 'X1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { lastUpdate: new Date(2010, 1, 1), type: 'X1000' },
      { lastUpdate: new Date(2010, 1, 1), type: 'H1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  it('sedFilter', () => {
    expect(BUCUtils.sedFilter({ status: 'empty' })).toBeFalsy()
    expect(BUCUtils.sedFilter({ status: 'notempty' })).toBeTruthy()
  })

  it('bucFilter', () => {
    expect(BUCUtils.bucFilter({ type: 'P_BUC_01' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ type: 'P_BUC_09' })).toBeTruthy()

    expect(BUCUtils.bucFilter({ type: 'H_BUC_01' })).toBeFalsy()
    expect(BUCUtils.bucFilter({ type: 'H_BUC_07' })).toBeTruthy()

    expect(BUCUtils.bucFilter({ type: 'R_BUC_01' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ type: 'R_BUC_02' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ type: 'R_BUC_03' })).toBeFalsy()

    expect(BUCUtils.bucFilter({ type: 'M_BUC_01' })).toBeFalsy()
    expect(BUCUtils.bucFilter({ type: 'M_BUC_02' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ type: 'M_BUC_03a' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ type: 'M_BUC_03b' })).toBeTruthy()
  })
})
