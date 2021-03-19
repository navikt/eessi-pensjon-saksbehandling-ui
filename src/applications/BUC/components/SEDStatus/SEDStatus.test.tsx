import { mount, ReactWrapper } from 'enzyme'
import SEDStatus, { Etikett, SEDStatusProps } from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  let wrapper : ReactWrapper
  const initialMockProps: SEDStatusProps = {
    highContrast: false,
    status: 'new'
  }

  it('Render: match snapshot', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='new' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure for sent status', () => {
    wrapper = mount(<SEDStatus {...initialMockProps} status='sent' />)
    expect(wrapper.exists(Etikett)).toBeTruthy()
    expect(wrapper.find(Etikett).props().type).toEqual('suksess')
  })
})
