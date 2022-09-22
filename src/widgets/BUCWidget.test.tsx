import { WidgetProps } from '@navikt/dashboard'
import { render } from '@testing-library/react'
import BUCWidget from './BUCWidget'

jest.mock('applications/BUC/', () => () => (<div className='mock-a-buc' />))

describe('widgets/BUCWidget', () => {
  let wrapper: any

  const initialMockProps: WidgetProps = {
    labels: {},
    onDelete: jest.fn(),
    onFullFocus: jest.fn(),
    onResize: jest.fn(),
    onRestoreFocus: jest.fn(),
    setMode: jest.fn(),
    onUpdate: jest.fn(),
    highContrast: false,
    myWidgets: {},
    widget: {
      i: 'i',
      type: 'buc',
      title: 'Buc',
      visible: true,
      options: {}
    }
  }

  beforeEach(() => {
    wrapper = render(<BUCWidget {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    const { container } = render(<BUCWidget {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('UseEffect: it tries to resize', () => {
    expect(initialMockProps.onResize).toHaveBeenCalled()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-BucWidget')).toBeTruthy()
    expect(wrapper.find('.mock-a-buc')).toBeTruthy()
  })

  it('Has properties', () => {
    expect(BUCWidget.properties).toHaveProperty('type')
    expect(BUCWidget.properties).toHaveProperty('title')
    expect(BUCWidget.properties).toHaveProperty('description')
    expect(BUCWidget.properties).toHaveProperty('layout')
    expect(BUCWidget.properties).toHaveProperty('options')
  })
})
