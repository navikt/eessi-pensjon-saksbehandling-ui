import React from 'react'
import Psycho from './Psycho'
import SmilendeOrangeVeileder from '../../../resources/images/NavPensjonSmilendeOrangeVeileder'
import TristOrangeVeileder from '../../../resources/images/NavPensjonTristOrangeVeileder'

describe('Psycho Rendering', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(<Psycho />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Render veileder correctly', () => {
    let wrapper = shallow(<Psycho />)

    expect(wrapper.containsMatchingElement(<SmilendeOrangeVeileder />)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<TristOrangeVeileder />)).toBeFalsy()

    wrapper.setProps({ type: 'trist' })

    expect(wrapper.containsMatchingElement(<SmilendeOrangeVeileder />)).toBeFalsy()
    expect(wrapper.containsMatchingElement(<TristOrangeVeileder />)).toBeTruthy()
  })
})
