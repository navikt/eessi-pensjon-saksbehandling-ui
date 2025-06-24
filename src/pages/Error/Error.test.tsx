import { render, screen } from '@testing-library/react'
import { Error as PageError, ErrorPageProps } from './Error'

jest.mock('src/components/TopContainer/TopContainer', () => {
  return ({ children }: { children: JSX.Element }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

describe('src/pages/Error', () => {
  const initialMockProps: ErrorPageProps = {
    error: {
      stack: 'foo'
    },
    type: 'mockType'
  }

  it('Render: Page forbidden: Has proper HTML structure', () => {
    render(<PageError {...initialMockProps} type='forbidden' />)
    expect(screen.getByTestId('p-error--top-container-id')).toBeInTheDocument()
    expect(screen.getByTestId('c-eessipensjonveileder')).toBeTruthy()
    expect(screen.getByText('message:error-forbidden-title')).toBeInTheDocument()
    expect(screen.getByText('message:error-forbidden-description')).toBeInTheDocument()
    expect(screen.getByText('message:error-forbidden-footer')).toBeInTheDocument()
  })

  it('Render: Page notLogged: Has proper HTML structure', () => {
    render(<PageError {...initialMockProps} type='notLogged' />)
    expect(screen.getByTestId('p-error--top-container-id')).toBeTruthy()
    expect(screen.getByTestId('c-eessipensjonveileder')).toBeTruthy()
    expect(screen.getByText('message:error-notLogged-title')).toBeInTheDocument()
    expect(screen.getByText('message:error-notLogged-description')).toBeInTheDocument()
    expect(screen.getByText('message:error-notLogged-footer')).toBeInTheDocument()
  })

  it('Render: Page notInvited: Has proper HTML structure', () => {
    render(<PageError {...initialMockProps} type='notInvited' />)
    expect(screen.getByTestId('p-error--top-container-id')).toBeTruthy()
    expect(screen.getByTestId('c-eessipensjonveileder')).toBeTruthy()
    expect(screen.getByText('message:error-notInvited-title')).toBeInTheDocument()
    expect(screen.getByText('message:error-notInvited-description')).toBeInTheDocument()
    expect(screen.getByText('message:error-notInvited-footer')).toBeInTheDocument()
  })

  it('Render: Page internalError: Has proper HTML structure', () => {
    const mockError = new Error('Mock error')
    render(<PageError {...initialMockProps} type='internalError' error={mockError} />)
    expect(screen.getByTestId('p-error--top-container-id')).toBeTruthy()
    expect(screen.getByTestId('c-eessipensjonveileder')).toBeTruthy()
    expect(screen.getByText('message:error-internalError-title')).toBeInTheDocument()
    expect(screen.getByText('message:error-internalError-description')).toBeInTheDocument()
    expect(screen.getByTestId('p-error--content-error-id')).toBeTruthy()
    expect(screen.getByText('message:error-internalError-footer')).toBeInTheDocument()
  })

  it('Render: Page default: Has proper HTML structure', () => {
    render(<PageError {...initialMockProps} type='default' />)
    expect(screen.getByTestId('p-error--top-container-id')).toBeTruthy()
    expect(screen.getByTestId('c-eessipensjonveileder')).toBeTruthy()
    expect(screen.getByText('message:error-404-title')).toBeInTheDocument()
    expect(screen.getByText('message:error-404-description')).toBeInTheDocument()
  })
})
