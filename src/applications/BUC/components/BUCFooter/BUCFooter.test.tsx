import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { mount, ReactWrapper } from 'enzyme'
import { stageSelector } from 'setupTests'
import BUCFooter, { BUCFooterDiv, BUCFooterProps, BUCFooterSelector } from './BUCFooter'

const defaultSelector: BUCFooterSelector = {
  highContrast: false,
  rinaUrl: 'http://mockurl/rinaUrl'
}

describe('applications/BUC/components/BUCFooter/BUCFooter', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCFooterProps = {}

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<BUCFooter {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(BUCFooterDiv)).toBeTruthy()
  })

  it('Render: WaitingPanel shows if no RinaUrl given', () => {
    stageSelector(defaultSelector, { rinaUrl: undefined })
    wrapper = mount(<BUCFooter {...initialMockProps} />)
    expect(wrapper.exists(WaitingPanel)).toBeTruthy()
  })
})

