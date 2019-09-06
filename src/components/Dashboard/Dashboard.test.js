import React from 'react'
import { Dashboard } from './Dashboard'
import DashboardRender from 'components/Dashboard/DashboardRender'

const mockLayouts = {
  lg: [
    { i: 'w-6-person', x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
    { i: 'w-7-buc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
  ]
}

const mockWidgets = [
  { i: 'w-6-person', type: 'person', title: 'Person widget', options: {} },
  { i: 'w-7-buc', type: 'buc', title: 'BUC widget', options: {} }
]

const defaultLocalStorage = window.localStorage

const localStorageMock = (() => {
  let store = {}

  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    clear: function () {
      store = {}
    },
    initializeStore: function () {
      store = {
        'c-d-widgets': JSON.stringify(mockWidgets),
        'c-d-layouts': JSON.stringify(mockLayouts)
      }
    }
  }
})()

jest.mock('i18next', function () {
  const use = jest.fn()
  const init = jest.fn()
  const loadLanguages = jest.fn()
  const result = {
    use: use,
    init: init,
    loadLanguages: loadLanguages
  }
  use.mockImplementation(() => result)
  return result
})

jest.mock('components/Dashboard/DashboardRender', () => {
  return () => { return <div /> }
})

describe('components/Dashboard/Dashboard', () => {
  let wrapper
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString })
  }

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  })

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: defaultLocalStorage
    })
  })

  beforeEach(async () => {
    window.localStorage.initializeStore()
    await act(async () => {
      wrapper = mount(<Dashboard {...initialMockProps} />)
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Mounts', () => {
    const props = () => wrapper.find(DashboardRender).props()
    expect(props().mounted).toEqual(false)
    act(() => {
      wrapper.update()
    })
    expect(props().mounted).toEqual(true)
  })

  it('onLayoutChange', () => {
    const wrapper = shallow(<Dashboard {...initialMockProps} />)
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      props().onLayoutChange(null, 'mockLayoutValue')
    })
    expect(props().layouts).toEqual('mockLayoutValue')
  })

  it('onBreakpointChange', () => {
    const wrapper = shallow(<Dashboard {...initialMockProps} />)
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      props().onBreakpointChange('mockBreakpointValue')
    })
    expect(props().currentBreakpoint).toEqual('mockBreakpointValue')
  })

  it('setWidgets', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    expect(props().widgets).toEqual(mockWidgets)
    act(() => {
      props().setWidgets('MockValue')
    })
    act(() => {
      wrapper.update()
    })
    expect(props().widgets).toEqual('MockValue')
  })

  it('onEditModeOn', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    expect(props().editMode).toEqual(false)
    expect(props().addMode).toEqual(false)
    act(() => {
      props().onEditModeOn()
    })
    act(() => {
      wrapper.update()
    })
    expect(props().editMode).toEqual(true)
    expect(props().addMode).toEqual(false)
  })

  it('onCancelEdit', () => {
    const props = () => wrapper.find(DashboardRender).props()

    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual(mockLayouts)
    act(() => {
      props().onEditModeOn()
    })

    act(() => {
      wrapper.update()
    })
    expect(props().editMode).toEqual(true)
    act(() => {
      props().onLayoutChange(null, { lg: [] })
    })

    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual({ lg: [] })
    act(() => {
      props().onCancelEdit()
    })

    act(() => {
      wrapper.update()
    })
    expect(props().editMode).toEqual(false)
    expect(props().layouts).toEqual(mockLayouts)
  })

  it('onSaveEdit', async () => {
    const props = () => wrapper.find(DashboardRender).props()

    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual(mockLayouts)
    expect(props().widgets).toEqual(mockWidgets)
    act(() => {
      props().onEditModeOn()
    })

    act(() => {
      wrapper.update()
    })
    expect(props().editMode).toEqual(true)
    act(() => {
      props().onLayoutChange(null, { lg: [] })
    })
    act(() => {
      props().setWidgets([])
    })

    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual({ lg: [] })
    expect(props().widgets).toEqual([])
    await act(async () => {
      await props().onSaveEdit()
    })

    act(() => {
      wrapper.update()
    })
    const widgets = await window.localStorage.getItem('c-d-widgets')
    const layouts = await window.localStorage.getItem('c-d-layouts')

    expect(props().editMode).toEqual(false)
    expect(JSON.parse(layouts)).toEqual({ lg: [] })
    expect(JSON.parse(widgets)).toEqual([])
  })

  it('onAddChange', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    expect(props().addMode).toEqual(false)
    act(() => {
      props().onAddChange()
    })
    act(() => {
      wrapper.update()
    })
    expect(props().addMode).toEqual(true)
    act(() => {
      props().onAddChange()
    })
    act(() => {
      wrapper.update()
    })
    expect(props().addMode).toEqual(false)
  })

  it('onWidgetUpdate', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    expect(props().widgets).toEqual(mockWidgets)
    act(() => {
      props().onWidgetUpdate({
        i: 'w-6-person',
        type: 'horse',
        title: 'horse widget',
        options: { legs: 4, mane: true }
      }, { i: 'w-6-person' })
    })
    act(() => {
      wrapper.update()
    })
    expect(props().widgets).toEqual([{
      i: 'w-6-person',
      type: 'horse',
      title: 'horse widget',
      options: { legs: 4, mane: true }
    }, {
      i: 'w-7-buc',
      type: 'buc',
      title: 'BUC widget',
      options: {}
    }])
  })

  it('onWidgetResize', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    act(() => {
      props().onBreakpointChange('lg')
    })
    act(() => {
      wrapper.update()
    })
    act(() => {
      props().onWidgetResize({ i: 'w-6-person', x: 99, y: 99, w: 99, h: 99, minW: 99, maxW: 99, minH: 99, maxH: 99 })
    })
    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual({
      lg: [
        { i: 'w-6-person', x: 99, y: 99, w: 99, h: 99, minW: 99, maxW: 99, minH: 99, maxH: 99 },
        { i: 'w-7-buc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
      ]
    })
  })

  it('onWidgetDelete', () => {
    const props = () => wrapper.find(DashboardRender).props()
    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual(mockLayouts)
    act(() => {
      props().onWidgetDelete({ i: 'w-6-person' })
    })
    act(() => {
      wrapper.update()
    })
    expect(props().layouts).toEqual({
      lg: [{ i: 'w-7-buc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }]
    })
  })
})
