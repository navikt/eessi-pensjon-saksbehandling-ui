import React from 'react'

import ConnectedDrawer, { Drawer } from './Drawer'

import * as reducers from '../../../reducers'

const reducer = combineReducers({
  ...reducers
})
const mockActions = {}

describe('Drawer Rendering', () => {
  it('Renders without crashing', () => {
    const Child = <div id='Child' />
    const SideContent = <div id='SideContent' />

    let wrapper = shallow(
      <Drawer
        sideContent={SideContent}
        drawerOpen
        drawerEnabled
        actions={mockActions}
      >
        {Child}
      </Drawer>
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper.exists('#Child')).toEqual(true)
    expect(wrapper.exists('#SideContent')).toEqual(true)
  })

  it('Toggles with drawerEnabled prop', () => {
    const Child = <div id='Child' />

    let wrapper = shallow(
      <Drawer actions={mockActions} drawerEnabled={false} >
        {Child}
      </Drawer>
    )
    expect(wrapper.exists('#drawer-button')).toEqual(false)
    wrapper.setProps({ drawerEnabled: true })
    expect(wrapper.exists('#drawer-button')).toEqual(true)
  })
  it('Toggles with drawerOpen prop', () => {
    const Child = <div id='Child' />
    const SideContent = <div id='SideContent' />

    let wrapper = shallow(
      <Drawer
        actions={mockActions}
        drawerEnabled
        drawerOpen={false}
        sideContent={SideContent}
      >
        {Child}
      </Drawer>
    )
    expect(wrapper.hasClass('toggled')).toEqual(false)
    expect(wrapper.exists('#SideContent')).toEqual(false)
    wrapper.setProps({ drawerOpen: true })
    expect(wrapper.hasClass('toggled')).toEqual(true)
    expect(wrapper.exists('#SideContent')).toEqual(true)
  })
})

describe('Drawer logic', () => {
  it('Toggles drawer button', () => {
    let initialState = {
      ui: {
        drawerOpen: false,
        drawerWidth: 100,
        drawerOldWidth: 90,
        drawerEnabled: true
      }
    }

    let store = createStore(reducer, initialState)
    const Child = <div id='Child' />

    let wrapper = shallow(
      <ConnectedDrawer>
        {Child}
      </ConnectedDrawer>,
      { context: { store } }
    )
    expect(wrapper.render().hasClass('toggled')).toEqual(false)
    wrapper.dive().find('#drawer-button').simulate('click')
    expect(wrapper.render().hasClass('toggled')).toEqual(true)
  })

  it('Changes width onMouseMove', () => {
    let style = {}

    let initialState = {
      ui: {
        drawerOpen: true,
        drawerWidth: 100,
        drawerOldWidth: 100,
        drawerEnabled: true
      }
    }

    let store = createStore(reducer, initialState)

    const Child = <div id='Child' />

    const wrapper = mount(
      <ConnectedDrawer>
        {Child}
      </ConnectedDrawer>,
      { context: { store } }
    )

    wrapper.find('#drawer-button').simulate('mouseDown')
    wrapper.find('.c-ui-drawer').simulate('mouseMove', { clientX: 500 })
    wrapper.find('#drawer-button').simulate('mouseUp')

    style = wrapper.find('#drawer').props().style
    expect(style.width).toEqual(500)

    wrapper.find('#drawer-button').simulate('mouseDown')
    wrapper.find('.c-ui-drawer').simulate('mouseMove', { clientX: 200 })
    wrapper.find('#drawer-button').simulate('mouseUp')

    style = wrapper.find('#drawer').props().style
    expect(style.width).toEqual(200)

    wrapper.find('#drawer-button').simulate('mouseDown')
    wrapper.find('.c-ui-drawer').simulate('mouseMove', { clientX: 0 })
    wrapper.find('#drawer-button').simulate('mouseUp')

    style = wrapper.find('#drawer').props().style
    expect(style.width).toEqual(10)
  })
})
