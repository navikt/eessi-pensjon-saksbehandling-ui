import SEDListHeader, {
  SEDListHeaderPanel,
  SEDListHeaderProps,
  SEDListSelector
} from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import { Buc, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import mockBucs from 'mocks/buc/bucs'
import React from 'react'
import { stageSelector } from 'setupTests'

jest.mock('rc-tooltip', () => ({ children }: any) => (
  <div data-test-id='mock-tooltip'>{children}</div>
))

const defaultSelector: SEDListSelector = {
  highContrast: false,
  locale: 'nb'
}

describe('applications/BUC/components/SEDListHeader/SEDListHeader', () => {
  const buc: Buc = mockBucs()[0] as Buc
  const sed: Sed = buc.seds![0]
  sed.status = 'received'
  const initialMockProps: SEDListHeaderProps = {
    buc: buc,
    followUpSeds: [buc.seds![1]],
    onSEDNew: jest.fn(),
    sed: sed
  }
  let wrapper: ReactWrapper

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<SEDListHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDListHeaderPanel)).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__name-id\']').hostNodes().render().text()).toEqual('X008 - buc:buc-X008')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__status-id\']').render().text()).toEqual('buc:status-' + sed.status)
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__version-date-id\']').hostNodes().render().text()).toEqual('23.10.2019')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__version-id\']').hostNodes().render().text()).toEqual('ui:version: 1')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__institutions-id\']').first().render().text()).toEqual('NAV ACCEPTANCE TEST 07')
    expect(wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__institutions-id\']').last().render().text()).toEqual('NAV ACCEPTANCE TEST 08')

    const actions = wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__actions-id\']').hostNodes()
    expect(actions.exists('FilledPaperClipIcon')).toBeTruthy()

    expect(actions.exists('[data-test-id=\'a-buc-c-sedlistheader__answer-button-id\']')).toBeTruthy()
  })

  it('Handling: handling answer button click', () => {
    (initialMockProps.onSEDNew as jest.Mock).mockReset()
    const replySedButton = wrapper.find('[data-test-id=\'a-buc-c-sedlistheader__answer-button-id\']').hostNodes().first()
    replySedButton.simulate('click')
    expect(initialMockProps.onSEDNew).toBeCalledWith(buc, sed)
  })
})
