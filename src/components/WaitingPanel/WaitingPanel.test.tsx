import { mount, ReactWrapper } from 'enzyme'
import WaitingPanel, { WaitingPanelDiv } from './WaitingPanel'

describe('components/WaitingPanel/WaitingPanel', () => {
  let wrapper: ReactWrapper

  it('Render: match snapshot', () => {
    wrapper = mount(<WaitingPanel message='' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    wrapper = mount(<WaitingPanel message='testmessage' />)
    expect(wrapper.exists(WaitingPanelDiv)).toBeTruthy()
    expect(wrapper.find('[data-test-id=\'c-waitingpanel__text-id\']').hostNodes().text()).toEqual('testmessage')
  })
})
