import { Buc, Sed } from 'src/declarations/buc'
import { JoarkBrowserItem } from 'src/declarations/joark'
import { Labels } from 'src/declarations/app.d'
import Mustache from 'mustache'
import personAvdod from 'src/mocks/person/personAvdod'
import joarkItems from 'src/mocks/joark/items'
import { countrySorter, renderAvdodName, sedAttachmentSorter } from './BUCUtils'
import * as BUCUtils from './BUCUtils'

const CORRECT_ORDER = -1
const WRONG_ORDER_WILL_SWAP = 1

describe('applications/BUC/components/BUCUtils/BUCUtils', () => {
  let t:  (label: string, vars?: any) => string

  beforeEach(() => {
    t = jest.fn().mockImplementation((label, vars) => {
      const translations: Labels = {
        'buc:buc-P2000': 'Krav om uføretrygd',
        'buc:buc-P3000_XX': 'Landspesifikk informasjon til {{country}}',
        'buc:relasjon-FAR': 'Far',
        'buc:relasjon-MOR': 'Mor',
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
    direction: 'IN',
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
    cdm: "4.2",
    type: 'P2000',
    caseId: '123',
    sakType: 'Alderspensjon',
    creator: {
      institution: 'mockInstitution',
      country: 'mockCountry',
      name: 'mockName',
      acronym: 'mockAcronym'
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

  it('countrySorter() should not fail when country code does not exist', () => {
    const sort = countrySorter('nb')
    expect(sort('lt', 'xx')).toEqual(CORRECT_ORDER)
  })

  it('getBucTypeLabel()', () => {
    expect(BUCUtils.getBucTypeLabel({
      type: 'P2000',
      locale: 'nb',
      t
    })).toEqual('Krav om uføretrygd')

    expect(BUCUtils.getBucTypeLabel({
      type: 'P3000_NO',
      locale: 'nb',
      t
    })).toEqual('Landspesifikk informasjon til Norge')

    expect(BUCUtils.getBucTypeLabel({
      type: 'P3000_YY',
      locale: 'nb',
      t
    })).toEqual('Landspesifikk informasjon til ukjent land')
  })

  it('labelSorter()', () => {
    expect(BUCUtils.labelSorter({ label: 'A', value: 'B' }, { label: 'B', value: 'A' })).toEqual(CORRECT_ORDER)
    expect(BUCUtils.labelSorter({ label: 'B', value: 'B' }, { label: 'A', value: 'A' })).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  it('renderAvdodName()', () => {
    expect(renderAvdodName(personAvdod(1)![0], t)).toEqual('MOR AVDØD1 - personFarFnr (Mor)')
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
      { ...mockSed, lastUpdate: new Date(2010, 1, 2).getTime(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 2).getTime(), type: 'P1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P2000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P10000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P2000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'P1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'X1000' }
    )).toEqual(CORRECT_ORDER)

    expect(BUCUtils.sedSorter(
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'X1000' },
      { ...mockSed, lastUpdate: new Date(2010, 1, 1).getTime(), type: 'H1000' }
    )).toEqual(WRONG_ORDER_WILL_SWAP)
  })

  describe('hasBlockingDraftSed', () => {
    it('returns true for each mapped BUC type when its primary SED is a draft (status: new)', () => {
      Object.entries(BUCUtils.DRAFT_BLOCKING_SED_BY_BUC).forEach(([bucType, sedType]) => {
        const buc: Buc = {
          ...mockBuc,
          type: bucType,
          seds: [{ ...mockSed, type: sedType, status: 'new' }]
        }
        expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(true)
      })
    })

    it('returns false when the primary SED exists but is not a draft', () => {
      ['received', 'sent', 'active', 'empty'].forEach((status) => {
        const buc: Buc = {
          ...mockBuc,
          type: 'P_BUC_02',
          seds: [{ ...mockSed, type: 'P2100', status }]
        }
        expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(false)
      })
    })

    it('returns false when the draft SED is not the primary SED for the BUC type', () => {
      const buc: Buc = {
        ...mockBuc,
        type: 'P_BUC_02',
        seds: [{ ...mockSed, type: 'P6000', status: 'new' }]
      }
      expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(false)
    })

    it('returns false for unmapped BUC types even with a draft SED', () => {
      const buc: Buc = {
        ...mockBuc,
        type: 'P_BUC_06',
        seds: [{ ...mockSed, type: 'P5000', status: 'new' }]
      }
      expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(false)
    })

    it('returns true for P_BUC_05 when the P8000 is a draft', () => {
      const buc: Buc = {
        ...mockBuc,
        type: 'P_BUC_05',
        seds: [{ ...mockSed, type: 'P8000', status: 'new' }]
      }
      expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(true)
    })

    it('returns false for P_BUC_05 when only other SEDs are drafts', () => {
      const buc: Buc = {
        ...mockBuc,
        type: 'P_BUC_05',
        seds: [
          { ...mockSed, type: 'P8000', status: 'received' },
          { ...mockSed, type: 'P9000', status: 'new' }
        ]
      }
      expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(false)
    })

    it('returns false when the BUC has no SEDs', () => {
      const buc: Buc = { ...mockBuc, type: 'P_BUC_01', seds: [] }
      expect(BUCUtils.hasBlockingDraftSed(buc)).toBe(false)
    })
  })
})
