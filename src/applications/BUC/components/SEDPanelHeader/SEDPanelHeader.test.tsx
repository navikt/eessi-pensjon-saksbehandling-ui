import { mount, ReactWrapper } from 'enzyme'
import SEDPanelHeader, { ActionsDiv, SedDiv, SEDPanelHeaderDiv } from './SEDPanelHeader'

describe('applications/BUC/components/SEDPanelHeader/SEDPanelHeader', () => {
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<SEDPanelHeader />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDPanelHeaderDiv)).toBeTruthy()
    expect(wrapper.exists(ActionsDiv)).toBeTruthy()
    expect(wrapper.exists(SedDiv)).toBeTruthy()
    expect(wrapper.exists(SEDPanelHeaderDiv)).toBeTruthy()
  })
})
