import { setFollowUpSeds } from 'src/actions/buc'
import { sedFilter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import { BucsInfo, Tags } from 'src/declarations/buc'
import { fireEvent, render, screen } from '@testing-library/react'
import _ from 'lodash'
import personAvdod from 'src/mocks/person/personAvdod'
import mockBucs from 'src/mocks/buc/bucs'
import { stageSelector } from 'src/setupTests'
import BUCEdit, { BUCEditProps } from './BUCEdit'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/actions/buc', () => ({
  resetNewSed: jest.fn(),
  setCurrentBuc: jest.fn(),
  setFollowUpSeds: jest.fn(),
  getSedList: jest.fn(),
  setSedList: jest.fn()
}))
jest.mock('src/applications/BUC/components/SEDStart/SEDStart', () => {
  return () => <div data-testid='mock-sedstart' />
})
jest.mock('src/applications/BUC/components/BUCTools/BUCTools', () => {
  return () => <div data-testid='mock-buctools' />
})
jest.mock('src/applications/BUC/components/SEDPanel/SEDPanel', () => {
  return (props: any) => <div data-testid='mock-sedpanel' data-sed-type={props.sed?.type} />
})

const bucs = _.keyBy(mockBucs(), 'caseId')
const currentBuc = '195440'
const buc = bucs[currentBuc]

const defaultSelector = {
  aktoerId: '123',
  bucs,
  currentBuc,
  bucsInfo: {} as BucsInfo,
  locale: 'nb',
  newlyCreatedSed: undefined,
  newlyCreatedSedTime: undefined,
  personAvdods: personAvdod(1),
  featureToggles: {}
}

describe('src/applications/BUC/components/BUCEdit/BUCEdit', () => {
  const initialMockProps: BUCEditProps = {
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: shows no BUC content without bucs', () => {
    stageSelector(defaultSelector, { bucs: {} })
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.queryByTestId('a-buc-p-bucedit')).not.toBeInTheDocument()
  })

  it('Render: shows no BUC content without currentBuc', () => {
    stageSelector(defaultSelector, { currentBuc: undefined })
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.queryByTestId('a-buc-p-bucedit')).not.toBeInTheDocument()
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.getByTestId('a-buc-p-bucedit--back-button-id')).toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucedit--new-sed-button-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_sedsearch--panel-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_SEDPanelHeader')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCDetail')).toBeInTheDocument()
    expect(screen.getByTestId('mock-buctools')).toBeInTheDocument()
    expect(screen.getAllByTestId('mock-sedpanel').length).toBeGreaterThan(0)
  })

  it('Render: «Bestill ny SED» button is disabled when a blocking draft SED exists', () => {
    const draftP2100 = { ...buc.seds![0], id: 'draft-p2100', type: 'P2100', status: 'new' }
    const bucWithDraft = {
      ...buc,
      type: 'P_BUC_02',
      seds: [...buc.seds!, draftP2100]
    } as typeof buc
    stageSelector(defaultSelector, { bucs: { ...bucs, [currentBuc]: bucWithDraft } })
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.getByTestId('a-buc-p-bucedit--new-sed-button-id')).toBeDisabled()
  })

  it('Render: «Bestill ny SED» button is enabled when no blocking draft SED exists', () => {
    const bucWithoutDraft = {
      ...buc,
      type: 'P_BUC_02',
      readOnly: false,
      seds: buc.seds!.filter((s) => s.type !== 'P2100')
    } as typeof buc
    stageSelector(defaultSelector, { bucs: { ...bucs, [currentBuc]: bucWithoutDraft } })
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.getByTestId('a-buc-p-bucedit--new-sed-button-id')).not.toBeDisabled()
  })

  it('Handling: moves to mode newsed when button pressed', () => {
    (setFollowUpSeds as jest.Mock).mockReset()
    render(<BUCEdit {...initialMockProps} />)
    fireEvent.click(screen.getByTestId('a-buc-p-bucedit--new-sed-button-id'))
    expect(setFollowUpSeds).toHaveBeenCalled()
  })

  it('Handling: selecting a status triggers the filter functions', () => {
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(_.filter(buc.seds, sedFilter).length)

    const statusInput = document.getElementById('a_buc_c_sedsearch--status-select-id')!
    fireEvent.keyDown(statusInput, { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 })
    fireEvent.keyDown(statusInput, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(0)
  })

  it('Handling: typing a query triggers the filter functions', () => {
    render(<BUCEdit {...initialMockProps} />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(_.filter(buc.seds, sedFilter).length)

    fireEvent.change(screen.getByTestId('a_buc_c_sedsearch--query-input-id'), { target: { value: 'XXX' } })
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(0)
  })

  it('Handling: performs a query search that will not find elements', () => {
    render(<BUCEdit {...initialMockProps} initialSearch='XXX' />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(0)
  })

  it('Handling: performs a query search that will find elements', () => {
    render(<BUCEdit {...initialMockProps} initialSearch='P2000' />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(1)
  })

  it('Handling: performs a status search that will not find elements', () => {
    render(<BUCEdit {...initialMockProps} initialStatusSearch={[{ value: 'XXX' }] as Tags} />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(0)
  })

  it('Handling: performs a status search that will find elements', () => {
    render(<BUCEdit {...initialMockProps} initialStatusSearch={[{ label: 'ui:received', value: 'received' }]} />)
    expect(screen.queryAllByTestId('mock-sedpanel').length).toEqual(1)
  })
})
