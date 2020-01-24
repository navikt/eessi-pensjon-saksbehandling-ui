import { Buc, Sed } from 'declarations/buc'
import Mustache from 'mustache'
import sampleBucs from 'resources/tests/sampleBucs'
import * as BUCUtils from './BUCUtils'

describe('applications/BUC/components/BUCUtils/BUCUtils', () => {
  const t = jest.fn((label, vars) => Mustache.render(label, vars))
  const sed = sampleBucs[0].seds![0]

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
      { ...sed, lastUpdate: new Date(2010, 1, 2).getDate(), type: 'P1000' },
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...sed, lastUpdate: new Date(2010, 1, 2).getDate(), type: 'P1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P2000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P10000' },
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P2000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'X1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'X1000' },
      { ...sed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'H1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  const mockSed: Sed = {
    id: '123',
    type: 'mockType',
    status: 'received',
    creationDate: 1,
    lastUpdate: 2,
    participants: [],
    attachments: []
  }

  const mockBuc: Buc = {
    type: 'P2000',
    caseId: '123',
    sakType: 'mockSakType',
    creator: {
      institution: 'mockInstitution',
      country: 'mockCountry'
    },
    startDate: 1,
    lastUpdate: 2,
    institusjon: [],
    seds: [],
    status: 'mockStatus'
  }

  it('sedFilter', () => {
    expect(BUCUtils.sedFilter({ ...mockSed, status: 'empty' })).toBeFalsy()
    expect(BUCUtils.sedFilter({ ...mockSed, status: 'notempty' })).toBeTruthy()
  })

  it('bucFilter', () => {
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'P_BUC_01' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'P_BUC_09' })).toBeTruthy()

    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'H_BUC_01' })).toBeFalsy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'H_BUC_07' })).toBeTruthy()

    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'R_BUC_01' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'R_BUC_02' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'R_BUC_03' })).toBeFalsy()

    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'M_BUC_01' })).toBeFalsy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'M_BUC_02' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'M_BUC_03a' })).toBeTruthy()
    expect(BUCUtils.bucFilter({ ...mockBuc, type: 'M_BUC_03b' })).toBeTruthy()
  })
})
