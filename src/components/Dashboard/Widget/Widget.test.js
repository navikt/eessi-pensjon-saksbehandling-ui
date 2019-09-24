import React from 'react'
import Widget from './Widget'
jest.mock('applications/BUC/widgets/index', () => {
  return () => { return <div className='mock-Buc' /> }
})
jest.mock('widgets/PdfWidget', () => {
  return () => { return <div className='w-PdfWidget' /> }
})
jest.mock('widgets/Overview/OverviewWidget', () => {
  return () => { return <div className='w-PersonWidget' /> }
})
jest.mock('widgets/Links/LinksWidget', () => {
  return () => { return <div className='w-LinksWidget' /> }
})

describe('components/Dashboard/Widget/Widget', () => {
  let wrapper
  const initialMockProps = {
    actions: {},
    layout: {},
    onResize: jest.fn(),
    onUpdate: jest.fn(),
    onWidgetDelete: jest.fn(),
    onWidgetUpdate: jest.fn(),
    setMode: jest.fn(),
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      type: 'foo',
      title: 'mockTitle',
      options: {
        content: 'mockContent'
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<Widget {...initialMockProps} mode='view' />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders WidgetEdit', () => {
    wrapper.setProps({ mode: 'edit' })
    expect(wrapper.exists('WidgetEdit')).toBeTruthy()
  })

  it('Renders WidgetDelete', () => {
    wrapper.setProps({ mode: 'delete' })
    expect(wrapper.exists('WidgetDelete')).toBeTruthy()
  })

  it('Renders EkspandertbartWidget', () => {
    wrapper.setProps({ widget: { type: 'ekspandertbart', options: { content: 'mockContent' } } })
    expect(wrapper.exists('.w-EkspandertbartWidget')).toBeTruthy()
  })

  it('Renders VarslerWidget', () => {
    wrapper.setProps({ widget: { type: 'varsler' } })
    expect(wrapper.exists('.w-VarslerWidget')).toBeTruthy()
  })

  it('Renders SmileyWidget', () => {
    wrapper.setProps({ widget: { type: 'smiley', options: { mood: 'mockMood' } } })
    expect(wrapper.exists('.w-SmileyWidget')).toBeTruthy()
  })

  it('Renders CatMidget', () => {
    wrapper.setProps({ widget: { type: 'cat' } })
    expect(wrapper.exists('.w-catMidget')).toBeTruthy()
  })

  it('Renders NoteWidget', () => {
    wrapper.setProps({ widget: { type: 'note', options: { content: 'mockContent' } } })
    expect(wrapper.exists('.w-NoteWidget')).toBeTruthy()
  })

  it('Renders LinksWidget', () => {
    wrapper.setProps({ widget: { type: 'links', options: { collapsed: false } } })
    expect(wrapper.exists('.w-LinksWidget')).toBeTruthy()
  })

  it('Renders OverviewWidget', () => {
    wrapper.setProps({ widget: { type: 'overview' } })
    expect(wrapper.exists('.w-OverviewWidget')).toBeTruthy()
  })

  it('Renders PdfWidget', () => {
    wrapper.setProps({ widget: { type: 'pdf' } })
    expect(wrapper.exists('.w-PdfWidget')).toBeTruthy()
  })

  it('Renders BucWidget', () => {
    wrapper.setProps({ widget: { type: 'buc' } })
    expect(wrapper.exists('.w-BucWidget')).toBeTruthy()
  })
})
