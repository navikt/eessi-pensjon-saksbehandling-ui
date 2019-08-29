import React from 'react'
import Widget from './Widget'
jest.mock('applications/BUC/widgets/index', () => {
  return () => { return <div className='mock-Buc' /> }
})

describe('components/Dashboard/Widget/Widget', () => {
  const initialMockProps = {
    layout: {},
    onResize: jest.fn(),
    onWidgetDelete: jest.fn(),
    setMode: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      type: 'foo'
    }
  }

  it('Renders', () => {
    const wrapper = mount(<Widget {...initialMockProps} mode='view' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders WidgetEdit', () => {
    const wrapper = mount(<Widget {...initialMockProps} mode='edit' />)
    expect(wrapper.exists('WidgetEdit')).toBeTruthy()
  })

  it('Renders WidgetDelete', () => {
    const wrapper = mount(<Widget {...initialMockProps} mode='delete' />)
    expect(wrapper.exists('WidgetDelete')).toBeTruthy()
  })

  it('Renders BucWidget', () => {
    const wrapper = mount(<Widget {...initialMockProps} mode='view' widget={{ type: 'buc' }} />)
    expect(wrapper.exists('.w-BucWidget')).toBeTruthy()
  })
})
