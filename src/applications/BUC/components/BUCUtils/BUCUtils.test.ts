import { Buc, Sed } from 'declarations/buc'
import { JoarkBrowserItem } from 'declarations/joark'
import { Labels, T } from 'declarations/app.d'
import Mustache from 'mustache'
import personAvdod from 'mocks/app/personAvdod'
import joarkItems from 'mocks/joark/items'
import { countrySorter, renderAvdodName, sedAttachmentSorter } from './BUCUtils'
import * as BUCUtils from './BUCUtils'

const CORRECT_ORDER = -1
const WRONG_ORDER_WILL_SWAP = 1

describe('applications/BUC/components/BUCUtils/BUCUtils', () => {
  let t: T

  beforeEach(() => {
    t = jest.fn().mockImplementation((label, vars) => {
      const translations: Labels = {
        'buc:buc-P2000': 'Krav om uføretrygd',
        'buc:buc-P3000_XX': 'Landspesifikk informasjon til {{country}}',
        'buc:relasjon-REPA': 'Repa',
        'ui:unknownLand': 'ukjent land'
      }
      return Mustache.render(translations[label] || '---', vars)
    })
  })

  const mockSed: Sed = {
    id: '123',
    type: 'mockType',
    status: 'received',
    creationDate: 1,
    lastUpdate: 2,
    participants: [],
    attachments: [],
    firstVersion: {
      id: '1',
      date: 1
    },
    lastVersion: {
      id: '1',
      date: 1
    },
    allowsAttachments: true
  }

  const mockBuc: Buc = {
    type: 'P2000',
    caseId: '123',
    sakType: 'Alderspensjon',
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

  it('bucSorter()', () => {
    expect(BUCUtils.bucSorter(
      { ...mockBuc, startDate: new Date(2010, 1, 2).getDate() } as Buc,
      { ...mockBuc, startDate: new Date(2010, 1, 1).getDate() } as Buc
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.bucSorter(
      { ...mockBuc, startDate: new Date(2010, 1, 1).getDate() } as Buc,
      { ...mockBuc, startDate: new Date(2010, 1, 2).getDate() } as Buc
    )).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  it('bucFilter()', () => {
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

  it('countrySorter()', () => {
    const sort = countrySorter('nb')
    expect(sort('no', 'se')).toEqual(CORRECT_ORDER)
    expect(sort('no', 'dk')).toEqual(CORRECT_ORDER)
    expect(sort('no', 'ag')).toEqual(CORRECT_ORDER)
  })

  it('getBucTypeLabel()', () => {
    expect(BUCUtils.getBucTypeLabel({
      type: 'P2000',
      locale: 'nb',
      t: t
    })).toEqual('Krav om uføretrygd')

    expect(BUCUtils.getBucTypeLabel({
      type: 'P3000_NO',
      locale: 'nb',
      t: t
    })).toEqual('Landspesifikk informasjon til Norge')

    expect(BUCUtils.getBucTypeLabel({
      type: 'P3000_YY',
      locale: 'nb',
      t: t
    })).toEqual('Landspesifikk informasjon til ukjent land')
  })

  it('labelSorter()', () => {
    expect(BUCUtils.labelSorter({ label: 'A', value: 'B' }, { label: 'B', value: 'A' })).toEqual(CORRECT_ORDER)
    expect(BUCUtils.labelSorter({ label: 'B', value: 'B' }, { label: 'A', value: 'A' })).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  it('renderAvdodName()', () => {
    expect(renderAvdodName(personAvdod(1)![0], t)).toEqual('FRODIG BLYANT - 12345678902 (Repa)')
  })

  it('sedAttachmentSorter()', () => {
    expect(sedAttachmentSorter({
      ...joarkItems[0], type: 'sed'
    } as JoarkBrowserItem, {
      ...joarkItems[0], type: 'joark'
    } as JoarkBrowserItem)).toEqual(CORRECT_ORDER)

    expect(sedAttachmentSorter({
      ...joarkItems[0], type: 'joark'
    } as JoarkBrowserItem, {
      ...joarkItems[0], type: 'sed'
    } as JoarkBrowserItem)).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(sedAttachmentSorter({
      ...joarkItems[0], type: 'sed', key: 'b'
    } as JoarkBrowserItem, {
      ...joarkItems[0], type: 'sed', key: 'a'
    } as JoarkBrowserItem)).toEqual(CORRECT_ORDER)
  })

  it('sedFilter', () => {
    expect(BUCUtils.sedFilter({ ...mockSed, status: 'empty' })).toBeFalsy()
    expect(BUCUtils.sedFilter({ ...mockSed, status: 'notempty' })).toBeTruthy()
  })

  it('sedSorter', () => {
    const CORRECT_ORDER = -1
    const WRONG_ORDER_WILL_SWAP = 1
    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 2).getDate(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 2).getDate(), type: 'P1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P2000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P10000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P2000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'X1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'X1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getDate(), type: 'H1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)
  })
})
