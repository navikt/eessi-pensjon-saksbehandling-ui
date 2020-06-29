import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import EESSIPensjonVeilederPanel, { EESSIPensjonVeilederPanelProps } from './EESSIPensjonVeilederPanel'

describe('EESSIPensjonVeilederPanel Rendering', () => {
  let wrapper: ReactWrapper
  const initialMockProps: EESSIPensjonVeilederPanelProps = {}

  it('Renders', () => {
    wrapper = mount(<EESSIPensjonVeilederPanel><div className='child' /></EESSIPensjonVeilederPanel>)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render child components', () => {
    wrapper = mount(
      <EESSIPensjonVeilederPanel {...initialMockProps}>
        <div id='1' />
      </EESSIPensjonVeilederPanel>)
    expect(wrapper.find('Veilederpanel').children().length).toEqual(1)
    expect(wrapper.exists('div[id="1"]')).toBeTruthy()
  })

  it('Render closeButton', () => {
    wrapper = mount(
      <EESSIPensjonVeilederPanel closeButton={false}>
        <div id='1' />
      </EESSIPensjonVeilederPanel>)

    let child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toBeFalsy()

    wrapper.setProps({ closeButton: true })
    child = wrapper.find('Veilederpanel')

    expect(child.exists('a[href="#close"]')).toBeTruthy()
  })

  it('Renders null when button is clicked', () => {
    wrapper = mount(
      <EESSIPensjonVeilederPanel closeButton>
        <div id='1' />
      </EESSIPensjonVeilederPanel>
    )

    const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} }

    expect(wrapper.isEmptyRender()).toBeFalsy()

    wrapper.find('a').simulate('click', mockEvent)

    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
