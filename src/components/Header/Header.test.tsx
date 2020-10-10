import { clearData } from 'actions/app'
import { toggleHighContrast } from 'actions/ui'
import * as routes from 'constants/routes'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
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
  let wrapper: ReactWrapper
  const initialMockProps: HeaderProps = {
    highContrast: false,
    username: 'testUser'
  }

  beforeEach(() => {
    wrapper = mount(
      <Header {...initialMockProps} />
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Handling: clicking logo is handled', () => {
    (clearData as jest.Mock).mockReset();
    (mockHistoryPush as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'c-header__logo-link\']').hostNodes().simulate('click')
    expect(clearData).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalledWith({
      pathname: routes.ROOT,
      search: window.location.search
    })
  })

  it('Handling: Clicking highConstrast handled', () => {
    (toggleHighContrast as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'c-header__highcontrast-link-id\']').hostNodes().simulate('click')
    expect(toggleHighContrast).toHaveBeenCalled()
  })
})
