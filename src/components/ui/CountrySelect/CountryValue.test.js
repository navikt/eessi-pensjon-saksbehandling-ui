import React from 'react'
import CountryValue from './CountryValue'

describe('CountryValue Rendering', () => {
  it('Renders correctly', () => {

    let selectProps = {selectProps: {type: 'country'}}

    let testData =   {
      'value': 'NO',
      'label': 'Norway',
      'currency': 'NOK',
      'currencyLabel': 'Norwegian Kroner'
    }

    let wrapper = shallow(<CountryValue selectProps={selectProps} data={testData}/>)
    
    expect(wrapper).toMatchSnapshot()

    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper.children().length).toEqual(2)
    expect(wrapper.childAt(1).text()).toEqual('Norway')
    
    wrapper.setProps({selectProps: {selectProps: {type: 'currency'}}})

    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper.children().length).toEqual(2)
    expect(wrapper.childAt(1).text()).toEqual('NOK - Norwegian Kroner')
  })
})
