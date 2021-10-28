import { alertClear } from 'actions/alert'
import { closeModal } from 'actions/ui'
import { ModalContent } from 'declarations/components'
import { mount, ReactWrapper } from 'enzyme'
import { TopContainer, TopContainerProps, TopContainerSelector } from './TopContainer'
import { stageSelector } from 'setupTests'

/* jest.mock('use-error-boundary', () => ({
  __esModule: true, // this property makes it work
  default: () => ({
    ErrorBoundary: ({ children }: any) => <div className='mock-error-boundary'>{children}</div>
  })
})) */

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockHistoryPush
    })
  }
})

const defaultSelector: TopContainerSelector = {
  clientErrorParam: undefined,
  clientErrorStatus: 'ERROR',
  clientErrorMessage: 'mockErrorMessage',
  serverErrorMessage: undefined,
  error: undefined,
  expirationTime: undefined,
  footerOpen: false,
  gettingUserInfo: false,
  highContrast: false,
  isLoggingOut: false,
  modal: undefined,
  params: {},
  size: 'lg',
  username: 'mockUsername'
}

jest.mock('actions/alert', () => ({
  alertClear: jest.fn(),
  alertFailure: jest.fn()
}))

jest.mock('actions/ui', () => ({
  closeModal: jest.fn(),
  toggleHighContrast: jest.fn()
}))

describe('components/TopContainer', () => {
  let wrapper: ReactWrapper
  const initialMockProps: TopContainerProps = {
    header: 'mockHeader'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
    expect(wrapper.exists('Alert')).toBeTruthy()
    expect(wrapper.exists('SessionMonitor')).toBeTruthy()
    expect(wrapper.exists('Footer')).toBeTruthy()
    expect(wrapper.exists('Modal')).toBeFalsy()
  })

  it('Render: client error message', () => {
    (alertClear as jest.Mock).mockReset()
    stageSelector(defaultSelector, { clientErrorMessage: 'mockMessage|mockParams' })
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )

    expect(wrapper.find('.alertstripe__tekst').hostNodes().render().text()).toEqual('mockMessage|mockParams')
    wrapper.find('[data-test-id=\'c-alert__close-icon\']').hostNodes().simulate('click')
    expect(alertClear).toHaveBeenCalled()
  })

  it('Handling: open / closes modal', () => {
    expect(wrapper.exists('Modal')).toBeFalsy()
    const mockModal: ModalContent = {
      modalTitle: 'mockTitle',
      modalText: 'mockText',
      modalButtons: [{
        text: 'ok'
      }]
    }
    stageSelector(defaultSelector, { modal: mockModal })
    wrapper = mount(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )

    expect(wrapper.exists('Modal')).toBeTruthy()
    const modal = wrapper.find('Modal').first()
    modal.find('button').hostNodes().last().simulate('click')
    expect(closeModal).toHaveBeenCalled()
  })
})
