import { AlertDiv, IEAlertProps } from 'components/IEAlert/IEAlert'
import { mount, ReactWrapper } from 'enzyme'
import IEAlert from './IEAlert'

describe('components/IEAlert/IEAlert', () => {
  let wrapper: ReactWrapper
  const initialMockProps: IEAlertProps = {
    highContrast: false,
    onLinkClick: jest.fn()
  }

  it('Render: For IE, show alert', () => {
    // mock IE object
    Object.defineProperty(document, 'documentMode', {
      writable: true,
      value: 'something'
    })
    wrapper = mount(<IEAlert {...initialMockProps} />)
    expect(wrapper.exists(AlertDiv)).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
    Object.defineProperty(document, 'documentMode', {
      writable: true,
      value: undefined
    })
  })

  it('Render: For Edge, show alert', () => {
    // mock IE object
    Object.defineProperty(window, 'StyleMedia', {
      writable: true,
      value: 'something'
    } as any)
    wrapper = mount(<IEAlert {...initialMockProps} />)
    expect(wrapper.exists(AlertDiv)).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
    Object.defineProperty(window, 'StyleMedia', {
      writable: true,
      value: undefined
    } as any)
  })

  it('Render: For others, do not show alert', () => {
    // mock IE object
    wrapper = mount(<IEAlert {...initialMockProps} />)
    expect(wrapper.exists(AlertDiv)).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Handling: clicking logo', () => {
    (initialMockProps.onLinkClick as jest.Mock).mockReset()
    Object.defineProperty(document, 'documentMode', {
      writable: true,
      value: 'something'
    } as any)
    wrapper = mount(<IEAlert {...initialMockProps} />)
    wrapper.find('[data-test-id=\'c-iealert__link-id\']').hostNodes().simulate('click')
    expect(initialMockProps.onLinkClick).toHaveBeenCalled()
  })
})
