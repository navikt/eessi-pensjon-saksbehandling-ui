import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('Render: closed', () => {
    render(<Footer {...initialMockProps} footerOpen={false} />)
    expect(screen.getByRole('button')).toHaveClass('footerButtonClosed')
  })

  it('Render: open', () => {
    render(<Footer {...initialMockProps} footerOpen={true} />)
    expect(screen.getAllByRole('button')[0]).toHaveClass('footerButtonOpen')
  })



  it('Handling: Toggles open/closed with click', () => {
    (toggleFooterOpen as jest.Mock).mockReset()
    render(<Footer {...initialMockProps} footerOpen={false} />)
    screen.getByRole('button').click()
    expect(toggleFooterOpen).toHaveBeenCalled()
  })

  it('Handling: Adds a param', () => {
    (setStatusParam as jest.Mock).mockReset()
    render(<Footer {...initialMockProps} />)
    userEvent.selectOptions(screen.getByTestId('c-footer--select-id'), [screen.getByText('aktoerId')])
    userEvent.type(screen.getByTestId('c-footer--input-id'), '123')
    screen.getByTestId('c-footer--add-button-id').click()
    expect(setStatusParam).toHaveBeenCalled()
  })

  it('Handling: Remove a param', () => {
    (unsetStatusParam as jest.Mock).mockReset()
    render(<Footer {...initialMockProps} params={{ sakId: '123' }} />)
    expect(screen.getByTestId('c-footer--param-string')).toHaveTextContent('sakId 123')
    screen.getByTestId('c-footer--remove-button').click()
    expect(unsetStatusParam).toHaveBeenCalled()
  })
})
