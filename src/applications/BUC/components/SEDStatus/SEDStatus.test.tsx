import { mount, ReactWrapper } from 'enzyme'
import SEDStatus, { MyTag, SEDStatusProps } from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  let wrapper : ReactWrapper
  const initialMockProps: SEDStatusProps = {
    status: 'new'
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='new' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure for sent status', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='sent' />)
    expect(wrapper.exists(MyTag)).toBeTruthy()
    expect(wrapper.find(MyTag).props().type).toEqual('suksess')
  })
})
