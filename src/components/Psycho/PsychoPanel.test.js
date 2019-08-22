import React from 'react'
import PsychoPanel from './PsychoPanel'

describe('PsychoPanel Rendering', () => {
  it('Renders without crashing', () => {
    const wrapper = shallow(<PsychoPanel><div className='child' /></PsychoPanel>)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render child components', () => {
    const wrapper = shallow(
      <PsychoPanel>
        <div id='1' />
        <div id='2' />
        <div id='3' />
        <div id='4' />
      </PsychoPanel>)
    expect(wrapper.find('Veilederpanel').children().length).toEqual(4)
    expect(wrapper.exists('div[id="1"]')).toBeTruthy()
    expect(wrapper.exists('div[id="2"]')).toBeTruthy()
    expect(wrapper.exists('div[id="3"]')).toBeTruthy()
    expect(wrapper.exists('div[id="4"]')).toBeTruthy()
    expect(wrapper.exists('div[id="5"]')).toBeFalsy()
  })

  it('Render closeButton', () => {
    const wrapper = shallow(
      <PsychoPanel closeButton={false}>
        <div id='1' />
      </PsychoPanel>)

    let child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toBeFalsy()

    wrapper.setProps({ closeButton: true })
    child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toBeTruthy()
  })
})

describe('PsychoPanel button', () => {
  it('Renders null when button is clicked', () => {
    const wrapper = shallow(
      <PsychoPanel closeButton>
        <div id='1' />
      </PsychoPanel>
    )

    const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} }

    expect(wrapper.isEmptyRender()).toBeFalsy()

    wrapper.find('a').simulate('click', mockEvent)

    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
