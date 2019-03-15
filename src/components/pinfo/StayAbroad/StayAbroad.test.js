import React from 'react'
import { createStore } from 'redux'
import { connect } from 'react-redux'
import { StayAbroad } from './StayAbroad'

const t = jest.fn((translationString) => { return translationString })

describe('StayAbroad', () => {
  let store,
    wrapper,
    ConnectedStayAbroad

  beforeEach(() => {
    store = createStore(state => state)
    ConnectedStayAbroad = connect(null, null)(StayAbroad)
    wrapper = shallow(<ConnectedStayAbroad t={t} store={store} stayAbroad={[]} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.instance().state._period).toEqual({})
    expect(wrapper.instance().state.maxPeriods).toEqual(8)
  })

  it('setEditPeriod()', () => {
    let mockPeriod = { foo: 'bar' }
    wrapper.instance().setEditPeriod(mockPeriod)
    expect(wrapper.instance().state._period).toStrictEqual(mockPeriod)
  })

  it('renders in new mode with no _period', () => {
    expect(wrapper.find('.c-pinfo-stayAbroad.new').length).toEqual(1)
  })

  it('renders in edit mode with _period', () => {
    let mockPeriod = { foo: 'bar', id: '123' }
    wrapper.instance().setEditPeriod(mockPeriod)
    expect(wrapper.find('.c-pinfo-stayAbroad.edit').length).toEqual(1)
  })

  it('renders with maxPeriod message when having over 8 periods', () => {
    wrapper = shallow(<ConnectedStayAbroad t={t} store={store} stayAbroad={new Array(9)} />).dive()
    expect(wrapper.find('.c-pinfo-stayAbroad-maxPeriods').length).toEqual(1)
  })
})
