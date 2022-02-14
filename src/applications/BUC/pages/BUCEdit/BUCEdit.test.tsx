import { setFollowUpSeds } from 'actions/buc'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import { BucsInfo, Tags } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import personAvdod from 'mocks/person/personAvdod'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'
import BUCEdit, { BUCEditDiv, BUCEditProps } from './BUCEdit'

jest.mock('actions/buc', () => ({
  resetNewSed: jest.fn(),
  setCurrentBuc: jest.fn(),
  setFollowUpSeds: jest.fn()
}))
jest.mock('applications/BUC/components/SEDStart/SEDStart', () => {
  return () => <div className='mock-sedstart' />
})
jest.mock('applications/BUC/components/BUCTools/BUCTools', () => {
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
  highContrast: false,
  locale: 'nb',
  newlyCreatedSed: undefined,
  newlyCreatedSedTime: undefined,
  personAvdods: personAvdod(1),
  featureToggles: {}
}

describe('applications/BUC/widgets/BUCEdit/BUCEdit', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCEditProps = {
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCEdit {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Render: get nothing without bucs', () => {
    stageSelector(defaultSelector, { bucs: {} })
    wrapper = mount(<BUCEdit {...initialMockProps} />)
    expect(wrapper.render().html()).toEqual('')
  })

  it('Render: get nothing without currentBuc', () => {
    stageSelector(defaultSelector, { currentBuc: undefined })
    wrapper = mount(<BUCEdit {...initialMockProps} />)
    expect(wrapper.render().html()).toEqual('')
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCEditDiv)).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucedit__back-link-id\']')).toBeTruthy()
    expect(wrapper.exists('[data-test-id=\'a-buc-p-bucedit__new-sed-button-id\']')).toBeTruthy()
    expect(wrapper.exists(SEDSearch)).toBeTruthy()
    expect(wrapper.exists(SEDPanelHeader)).toBeTruthy()
    expect(wrapper.exists(BUCDetail)).toBeTruthy()
    expect(wrapper.exists(BUCTools)).toBeTruthy()
  })

  it('Handling: moves to mode newsed when button pressed', () => {
    (setFollowUpSeds as jest.Mock).mockReset()
    wrapper = mount(<BUCEdit {...initialMockProps} />)
    wrapper.find('[data-test-id=\'a-buc-p-bucedit__new-sed-button-id\']').hostNodes().simulate('click')
    expect(setFollowUpSeds).toBeCalled()
  })

  it('Handling: SEDSearch status start triggers the filter functions', () => {
    expect(wrapper.find(SEDPanel).length).toEqual(_.filter(buc.seds, sedFilter).length)

    const statusSelect = wrapper.find('[data-test-id=\'a-buc-c-sedsearch__status-select-id\'] input')
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: SEDSearch query search triggers the filter functions', () => {
    expect(wrapper.find(SEDPanel).length).toEqual(_.filter(buc.seds, sedFilter).length)
    wrapper.find('[data-test-id=\'a-buc-c-sedsearch__query-input-id\']').hostNodes().simulate('change', { target: { value: 'XXX' } })
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a query search that will not find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialSearch='XXX' />)
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a query search that will find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialSearch='P2000' />)
    expect(wrapper.find(SEDPanel).length).toEqual(1)
  })

  it('Handling: performs a status search that will not find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch={[{ value: 'XXX' }] as Tags} />)
    expect(wrapper.find(SEDPanel).length).toEqual(0)
  })

  it('Handling: performs a status search that will find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch={[{ label: 'ui:received', value: 'received' }]} />)
    expect(wrapper.find(SEDPanel).length).toEqual(1)
  })
})
