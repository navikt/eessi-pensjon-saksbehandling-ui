
import { render, screen } from '@testing-library/react'
import { Error as PageError, ErrorPageDiv, ErrorPageProps } from './Error'
import { Accordion } from '@navikt/ds-react'

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: { children: JSX.Element }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

describe('pages/Error', () => {
  let wrapper: any

  const initialMockProps: ErrorPageProps = {
    error: {
      stack: 'foo'
    },
    type: 'mockType'
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<PageError {...initialMockProps} type='something' />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: Page forbidden: Has proper HTML structure', () => {
    wrapper = render(<PageError {...initialMockProps} type='forbidden' />)
    expect(wrapper.exists(ErrorPageDiv)).toBeTruthy()
    expect(screen.getByTestId('p-error--veileder-id')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--title-id').hostNodes().render().text()).toEqual('ui:error-forbidden-title')
    expect(wrapper.find('[data-testid=\'p-error--description-id').hostNodes().render().text()).toEqual('ui:error-forbidden-description')
    expect(wrapper.find('[data-testid=\'p-error--footer-id').hostNodes().render().text()).toEqual('ui:error-forbidden-footer')
  })

  it('Render: Page notLogged: Has proper HTML structure', () => {
    wrapper = render(<PageError {...initialMockProps} type='notLogged' />)
    expect(wrapper.exists(ErrorPageDiv)).toBeTruthy()
    expect(screen.getByTestId('p-error--veileder-id')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--title-id').hostNodes().render().text()).toEqual('ui:error-notLogged-title')
    expect(wrapper.find('[data-testid=\'p-error--description-id').hostNodes().render().text()).toEqual('ui:error-notLogged-description')
    expect(wrapper.find('[data-testid=\'p-error--footer-id').hostNodes().render().text()).toEqual('ui:error-notLogged-footer')
  })

  it('Render: Page notInvited: Has proper HTML structure', () => {
    wrapper = render(<PageError {...initialMockProps} type='notInvited' />)
    expect(wrapper.exists(ErrorPageDiv)).toBeTruthy()
    expect(screen.getByTestId('p-error--veileder-id')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--title-id').hostNodes().render().text()).toEqual('ui:error-notInvited-title')
    expect(wrapper.find('[data-testid=\'p-error--description-id').hostNodes().render().text()).toEqual('ui:error-notInvited-description')
    expect(wrapper.find('[data-testid=\'p-error--footer-id').hostNodes().render().text()).toEqual('ui:error-notInvited-footer')
  })

  it('Render: Page internalError: Has proper HTML structure', () => {
    const mockError = new Error('Mock error')
    wrapper = render(<PageError {...initialMockProps} type='internalError' error={mockError} />)
    expect(wrapper.exists(ErrorPageDiv)).toBeTruthy()
    expect(screen.getByTestId('p-error--veileder-id')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--title-id').hostNodes().render().text()).toEqual('ui:error-internalError-title')
    expect(wrapper.find('[data-testid=\'p-error--description-id').hostNodes().render().text()).toEqual('ui:error-internalError-description')
    expect(wrapper.exists(Accordion)).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--footer-id').hostNodes().render().text()).toEqual('ui:error-internalError-footer')
  })

  it('Render: Page default: Has proper HTML structure', () => {
    wrapper = render(<PageError {...initialMockProps} type='default' />)
    expect(wrapper.exists(ErrorPageDiv)).toBeTruthy()
    expect(screen.getByTestId('p-error--veileder-id')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'p-error--title-id').hostNodes().render().text()).toEqual('ui:error-404-title')
    expect(wrapper.find('[data-testid=\'p-error--description-id').hostNodes().render().text()).toEqual('ui:error-404-description')
  })
})
