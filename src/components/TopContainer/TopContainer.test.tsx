/*import { render } from '@testing-library/react'
import { alertClear } from 'src/actions/alert'
import { closeModal } from 'src/actions/ui'
import { ModalContent } from 'src/declarations/components'

import { TopContainer, TopContainerProps, TopContainerSelector } from './TopContainer'
import { stageSelector } from 'src/setupTests'*/

/* jest.mock('use-error-boundary', () => ({
  --esModule: true, // this property makes it work
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

/*const defaultSelector: TopContainerSelector = {
  bannerStatus: 'error',
  bannerMessage: 'mockErrorMessage',
  error: undefined,
  footerOpen: false,
  gettingUserInfo: false,
  modal: undefined,
  params: {},
  size: 'lg',
  username: 'mockUsername'
}*/

jest.mock('src/actions/alert', () => ({
  alertClear: jest.fn(),
  alertFailure: jest.fn()
}))

jest.mock('src/actions/ui', () => ({
  closeModal: jest.fn(),
}))

describe('src/components/TopContainer', () => {
/*  let wrapper: any

  const initialMockProps: TopContainerProps = {
    header: 'mockHeader'
  }*/

  beforeEach(() => {
/*    stageSelector(defaultSelector, {})
    wrapper = render(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )*/
  })

  it('Render: has proper HTML structure', () => {

  })

/*  it('Render: client error message', () => {
    (alertClear as jest.Mock).mockReset()
    stageSelector(defaultSelector, { clientErrorMessage: 'mockMessage|mockParams' })
    wrapper = render(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )

    expect(wrapper.find('.alertstripe--tekst').hostNodes().render().text()).toEqual('mockMessage|mockParams')
    wrapper.find('[data-testid=\'c-alert--close-icon\']').hostNodes().simulate('click')
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
    wrapper = render(
      <TopContainer {...initialMockProps}>
        <div id='TEST_CHILD' />
      </TopContainer>
    )

    expect(wrapper.exists('Modal')).toBeTruthy()
    const modal = wrapper.find('Modal').first()
    modal.find('button').hostNodes().last().simulate('click')
    expect(closeModal).toHaveBeenCalled()
  })*/
})
