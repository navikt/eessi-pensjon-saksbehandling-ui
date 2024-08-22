import { AlertVariant } from 'src/declarations/components'
import { screen, render } from '@testing-library/react'
import BannerAlert, { BannerAlertProps } from './BannerAlert'

describe('src/components/Alert/Alert', () => {
  const initialMockProps: BannerAlertProps = {
    variant: 'error',
    message: 'mockErrorMessage',
    error: undefined,
    onClose: jest.fn()
  }

  it('Render: match snapshot', () => {
    const { container } = render(<BannerAlert {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<BannerAlert {...initialMockProps} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('mockErrorMessage')
  })

  it('Render: has proper HTML structure with error message', () => {
    render(<BannerAlert {...initialMockProps} error='mockError' />)
    expect(screen.getByRole('alert')).toHaveTextContent('mockErrorMessage: mockError')
  })

  it('Render: has proper HTML structure as client in OK type', () => {
    render(<BannerAlert {...initialMockProps} variant='success'/>)
    expect(screen.getByRole('alert').getAttribute('class')).toMatch(/status-success/gi)
  })

  it('Render: has proper HTML structure as client in WARNING type', () => {
    render(<BannerAlert {...initialMockProps} variant='warning' />)
    expect(screen.getByRole('alert').getAttribute('class')).toMatch(/status-warning/gi)
  })

  it('Render: has proper HTML structure as client in ERROR type', () => {
    render(<BannerAlert {...initialMockProps} variant='error' />)
    expect(screen.getByRole('alert').getAttribute('class')).toMatch(/status-error/gi)
  })

  it('Render: Pretty prints a error message', () => {
    const error = {
      status: 'error' as AlertVariant,
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    render(<BannerAlert {...initialMockProps} error={error} />)
    expect(screen.getByRole('alert')).toHaveTextContent('mockErrorMessage: message - error - uuid')
  })

  it('Render: Pretty prints a string error', () => {
    const error = 'error'
    render(<BannerAlert {...initialMockProps} error={error} />)
    expect(screen.getByRole('alert')).toHaveTextContent('mockErrorMessage: error')
  })

  it('Render: Close button to be in the document', () => {
    render(<BannerAlert {...initialMockProps} variant='error' />);
    expect(screen.getByTestId('c-alert--close-icon')).toBeInTheDocument();
  })
})
