import React from 'react'
import PsychoPanel from './PsychoPanel'

describe('PsychoPanel Rendering', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(<PsychoPanel><div className='child' /></PsychoPanel>)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render child components', () => {
    let wrapper = shallow(
      <PsychoPanel>
        <div id='1' />
        <div id='2' />
        <div id='3' />
        <div id='4' />
      </PsychoPanel>)
    expect(wrapper.find('Veilederpanel').children().length).toEqual(4)
    expect(wrapper.exists('div[id="1"]')).toEqual(true)
    expect(wrapper.exists('div[id="2"]')).toEqual(true)
    expect(wrapper.exists('div[id="3"]')).toEqual(true)
    expect(wrapper.exists('div[id="4"]')).toEqual(true)
    expect(wrapper.exists('div[id="5"]')).toEqual(false)
  })

  it('Render closeButton', () => {
    let wrapper = shallow(
      <PsychoPanel closeButton={false}>
        <div id='1' />
      </PsychoPanel>)

    let child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toEqual(false)

    wrapper.setProps({ closeButton: true })
    child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toEqual(true)
  })
})

describe('PsychoPanel button', () => {
  it('Renders null when button is clicked', () => {
    let wrapper = shallow(
      <PsychoPanel closeButton >
        <div id='1' />
      </PsychoPanel>
    )

    let mockEvent = { preventDefault: () => {}, stopPropagation: () => {} }

    expect(wrapper.isEmptyRender()).toEqual(false)

    wrapper.find('a').simulate('click', mockEvent)

    expect(wrapper.isEmptyRender()).toEqual(true)
  })
})
