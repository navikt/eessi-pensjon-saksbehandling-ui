import { clearData } from 'src/actions/app'
import * as routes from 'src/constants/routes'
import { screen, render } from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import Header, { HeaderProps } from './Header'

jest.mock('actions/app', () => ({
  clearData: jest.fn()
}))

const mockHistoryPush = jest.fn()

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockHistoryPush,
}));

describe('components/Header/Header', () => {
  const initialMockProps: HeaderProps = {
    username: 'testUser'
  }

  beforeEach(() => {
    stageSelector({}, {})
    render(<Header {...initialMockProps} />)
  })


  it('Render: match snapshot', () => {
    const { container } = render(<Header {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Handling: clicking logo is handled', () => {
    (clearData as jest.Mock).mockReset();
    (mockHistoryPush as jest.Mock).mockReset()
    screen.getByTestId('c-header--logo-link').click()
    expect(clearData).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
  })
})
