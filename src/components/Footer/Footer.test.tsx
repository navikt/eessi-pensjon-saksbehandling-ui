import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import { render } from '@testing-library/react'
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
  let wrapper: any

  const initialMockProps: FooterProps = {
    footerOpen: true,
    params: {}
  }

  beforeEach(() => {
    stageSelector({}, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<Footer {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Handling: Toggles open/closed with props', () => {
    wrapper = render(<Footer {...initialMockProps} footerOpen={false} />)
    expect(wrapper.exists('.footerButtonClosed')).toBeTruthy()
    wrapper.setProps({ footerOpen: true })
    expect(wrapper.exists('.footerButtonOpen')).toBeTruthy()
  })

  it('Handling: Toggles open/closed with click', () => {
    (toggleFooterOpen as jest.Mock).mockReset()
    wrapper = render(<Footer {...initialMockProps} footerOpen={false} />)
    wrapper.find('.footerButtonClosed').hostNodes().simulate('click')
    expect(toggleFooterOpen).toHaveBeenCalled()
  })

  it('Handling: Adds a param', () => {
    (setStatusParam as jest.Mock).mockReset()
    wrapper = render(<Footer {...initialMockProps} />)
    wrapper.find('[data-testid=\'c-footer--select-id').hostNodes().simulate('change', { target: { value: 'aktoerId' } })
    wrapper.find('[data-testid=\'c-footer--input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('[data-testid=\'c-footer--add-button-id').hostNodes().simulate('click')
    expect(setStatusParam).toHaveBeenCalled()
  })

  it('Handling: Remove a param', () => {
    (unsetStatusParam as jest.Mock).mockReset()
    wrapper = render(<Footer {...initialMockProps} params={{ sakId: '123' }} />)
    expect(wrapper.find('[data-testid=\'c-footer--param-string\']').hostNodes().render().text()).toEqual('sakId 123')
    wrapper.find('[data-testid=\'c-footer--remove-button\']').hostNodes().simulate('click')
    expect(unsetStatusParam).toHaveBeenCalled()
  })
})
