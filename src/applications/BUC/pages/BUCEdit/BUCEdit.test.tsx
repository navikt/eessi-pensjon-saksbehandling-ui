import { setFollowUpSeds } from 'src/actions/buc'
import BUCDetail from 'src/applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'src/applications/BUC/components/BUCTools/BUCTools'
import { sedFilter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'src/applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'src/applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'src/applications/BUC/components/SEDSearch/SEDSearch'
import { BucsInfo, Tags } from 'src/declarations/buc'
import { render, screen } from '@testing-library/react'
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
  setFollowUpSeds: jest.fn()
}))
jest.mock('src/applications/BUC/components/SEDStart/SEDStart', () => {
  return () => <div className='mock-sedstart' />
})
jest.mock('src/applications/BUC/components/BUCTools/BUCTools', () => {
  return () => <div className='mock-buctools' />
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
  let wrapper: any

  const initialMockProps: BUCEditProps = {
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(<BUCEdit {...initialMockProps} />)
  })

  it('Render: get nothing without bucs', () => {
    stageSelector(defaultSelector, { bucs: {} })
    wrapper = render(<BUCEdit {...initialMockProps} />)
    expect(wrapper.render().html()).toEqual('')
  })

  it('Render: get nothing without currentBuc', () => {
    stageSelector(defaultSelector, { currentBuc: undefined })
    wrapper = render(<BUCEdit {...initialMockProps} />)
    expect(wrapper.render().html()).toEqual('')
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId('a-buc-p-bucedit--back-link-id')).toBeInTheDocument()
    expect(screen.getByTestId('a-buc-p-bucedit--new-sed-button-id')).toBeInTheDocument()
    expect(wrapper.exists(SEDSearch)).toBeTruthy()
    expect(wrapper.exists(SEDPanelHeader)).toBeTruthy()
    expect(wrapper.exists(BUCDetail)).toBeTruthy()
    expect(wrapper.exists(BUCTools)).toBeTruthy()
  })

  it('Handling: moves to mode newsed when button pressed', () => {
    (setFollowUpSeds as jest.Mock).mockReset()
    wrapper = render(<BUCEdit {...initialMockProps} />)
    wrapper.find('[data-testid=\'a-buc-p-bucedit--new-sed-button-id').hostNodes().simulate('click')
    expect(setFollowUpSeds).toHaveBeenCalled()
  })

  it('Handling: SEDSearch status start triggers the filter functions', () => {
    expect(wrapper.find(SEDPanel).length).toEqual(_.filter(buc.seds, sedFilter).length)

    const statusSelect = wrapper.find('[data-testid=\'a_buc_c_sedsearch--status-select-id\'] input')
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: SEDSearch query search triggers the filter functions', () => {
    expect(wrapper.find(SEDPanel).length).toEqual(_.filter(buc.seds, sedFilter).length)
    wrapper.find('[data-testid=\'a_buc_c_sedsearch--query-input-id').hostNodes().simulate('change', { target: { value: 'XXX' } })
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a query search that will not find elements', () => {
    wrapper = render(<BUCEdit {...initialMockProps} initialSearch='XXX' />)
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a query search that will find elements', () => {
    wrapper = render(<BUCEdit {...initialMockProps} initialSearch='P2000' />)
    expect(wrapper.find(SEDPanel).length).toEqual(1)
  })

  it('Handling: performs a status search that will not find elements', () => {
    wrapper = render(<BUCEdit {...initialMockProps} initialStatusSearch={[{ value: 'XXX' }] as Tags} />)
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a status search that will find elements', () => {
    wrapper = render(<BUCEdit {...initialMockProps} initialStatusSearch={[{ label: 'ui:received', value: 'received' }]} />)
    expect(wrapper.find(SEDPanel).length).toEqual(1)
  })
})
