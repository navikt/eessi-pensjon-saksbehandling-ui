import { AlertVariant } from 'declarations/components'
import { render } from '@testing-library/react'
import BannerAlert, { BannerAlertDiv, BannerAlertProps } from './BannerAlert'

describe('components/Alert/Alert', () => {
  let wrapper: any
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
    expect(wrapper.exists(BannerAlertDiv)).toBeTruthy()
    expect(wrapper.find('.alertstripe--tekst').hostNodes().render().text()).toEqual('mockErrorMessage')
  })

  it('Render: has proper HTML structure with error message', () => {
    render(<BannerAlert {...initialMockProps} error='mockError' />)
    expect(wrapper.find('.alertstripe--tekst').hostNodes().render().text()).toEqual('mockErrorMessage: mockError')
  })

  it('Render: has proper HTML structure as client in OK type', () => {
    render(<BannerAlert {...initialMockProps} />)
    expect(wrapper.render().hasClass('alertstripe--suksess')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in WARNING type', () => {
    render(<BannerAlert {...initialMockProps} variant='warning' />)
    expect(wrapper.render().hasClass('alertstripe--advarsel')).toBeTruthy()
  })

  it('Render: has proper HTML structure as client in ERROR type', () => {
    render(<BannerAlert {...initialMockProps} variant='error' />)
    expect(wrapper.render().hasClass('alertstripe--feil')).toBeTruthy()
  })

  it('Render: Pretty prints a error message', () => {
    const error = {
      status: 'error' as AlertVariant,
      message: 'message',
      error: 'error',
      uuid: 'uuid'
    }
    render(<BannerAlert {...initialMockProps} error={error} />)
    expect(wrapper.find('.alertstripe--tekst').hostNodes().render().text()).toEqual('mockErrorMessage: message - error - uuid')
  })

  it('Render: Pretty prints a string error', () => {
    const error = 'error'
    render(<BannerAlert {...initialMockProps} error={error} />)
    expect(wrapper.find('.alertstripe--tekst').hostNodes().render().text()).toEqual('mockErrorMessage: error')
  })

  it('Handling: close button clears alert', () => {
    (initialMockProps.onClose as jest.Mock).mockReset()
    render(<BannerAlert {...initialMockProps} variant='error' />)
    wrapper.find('[data-test-id=\'c-alert--close-icon\']').hostNodes().simulate('click')
    expect(initialMockProps.onClose).toHaveBeenCalled()
  })
})
