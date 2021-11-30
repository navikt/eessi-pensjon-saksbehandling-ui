import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import { mount, ReactWrapper } from 'enzyme'
import { stageSelector } from 'setupTests'
import Footer, { FooterProps } from './Footer'

jest.mock('actions/ui', () => ({
  toggleFooterOpen: jest.fn()
}))
jest.mock('actions/app', () => ({
  setStatusParam: jest.fn(),
  unsetStatusParam: jest.fn()
}))
describe('components/Footer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: FooterProps = {
    footerOpen: true,
    params: {}
  }

  beforeEach(() => {
    stageSelector({}, {})
  })

  it('Render: match snapshot', () => {
    wrapper = mount(<Footer {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Handling: Toggles open/closed with props', () => {
    wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    expect(wrapper.exists('.footerButtonClosed')).toBeTruthy()
    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('.footerButtonOpen')).toBeTruthy()
  })

  it('Handling: Toggles open/closed with click', () => {
    (toggleFooterOpen as jest.Mock).mockReset()
    wrapper = mount(<Footer {...initialMockProps} footerOpen={false} />)
    wrapper.find('.footerButtonClosed').hostNodes().simulate('click')
    expect(toggleFooterOpen).toHaveBeenCalled()
  })

  it('Handling: Adds a param', () => {
    (setStatusParam as jest.Mock).mockReset()
    wrapper = mount(<Footer {...initialMockProps} />)
    wrapper.find('[data-test-id=\'c-footer__select-id\']').hostNodes().simulate('change', { target: { value: 'aktoerId' } })
    wrapper.find('[data-test-id=\'c-footer__input-id\']').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-test-id=\'c-footer__add-button-id\']').hostNodes().simulate('click')
    expect(setStatusParam).toHaveBeenCalled()
  })

  it('Handling: Remove a param', () => {
    (unsetStatusParam as jest.Mock).mockReset()
    wrapper = mount(<Footer {...initialMockProps} params={{ sakId: '123' }} />)
    expect(wrapper.find('[data-test-id=\'c-footer__param-string\']').hostNodes().render().text()).toEqual('sakId 123')
    wrapper.find('[data-test-id=\'c-footer__remove-button\']').hostNodes().simulate('click')
    expect(unsetStatusParam).toHaveBeenCalled()
  })
})
