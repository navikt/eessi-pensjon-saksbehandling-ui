import { clearData } from 'actions/app'
import { toggleHighContrast } from 'actions/ui'
import * as routes from 'constants/routes'
import { render } from '@testing-library/react'
import { stageSelector } from 'setupTests'
import Header, { HeaderProps } from './Header'

jest.mock('actions/app', () => ({
  clearData: jest.fn()
}))
jest.mock('actions/ui', () => ({
  toggleHighContrast: jest.fn()
}))

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockHistoryPush
    }),
    useLocation: () => ({
      pathname: '/mockPathname'
    })
  }
})

describe('components/Header/Header', () => {
  let wrapper: any

  const initialMockProps: HeaderProps = {
    username: 'testUser'
  }

  beforeEach(() => {
    stageSelector({}, {})
    wrapper = render(<Header {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<Header {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Handling: clicking logo is handled', () => {
    (clearData as jest.Mock).mockReset();
    (mockHistoryPush as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'c-header--logo-link\']').hostNodes().simulate('click')
    expect(clearData).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
  })

  it('Handling: Clicking highConstrast handled', () => {
    (toggleHighContrast as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'c-header--highcontrast-link-id').hostNodes().simulate('click')
    expect(toggleHighContrast).toHaveBeenCalled()
  })
})
