import React from 'react'
import DatePicker from './DatePicker'

describe('DatePicker', () => {
  it('renders without crashing', () => {
    let component = shallow(<DatePicker onChange={function () { }} />)
    expect(component).toMatchSnapshot()
  })

  it('Correctly validates day', ()=>{
    let component = shallow(<DatePicker onChange={function () { }}/>)
    expect(component.instance().checkValidity({ day: 'DD' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '-1' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '0' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '10' }).day).toEqual(undefined)
    expect(component.instance().checkValidity({ day: 10 }).day).toEqual(undefined)
    expect(component.instance().checkValidity({ day: '50' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '31', month: '3' }).day).toEqual(undefined)
    expect(component.instance().checkValidity({ day: '31', month: '4' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '29', month: '2', year: '2001' }).day).toEqual(true)
    expect(component.instance().checkValidity({ day: '29', month: '2', year: '2000' }).day).toEqual(undefined)
    expect(component.instance().checkValidity({ day: '28', month: '2', year: '2001' }).day).toEqual(undefined)
  })

  it('Correctly validates month', ()=>{
    let component = shallow(<DatePicker onChange={function() {} }/>)
    expect(component.instance().checkValidity({ month: 'MM' }).month).toEqual(true)
    expect(component.instance().checkValidity({ month: '-1' }).month).toEqual(true)
    expect(component.instance().checkValidity({ month: '0' }).month).toEqual(true)
    expect(component.instance().checkValidity({ month: '1' }).month).toEqual(undefined)
    expect(component.instance().checkValidity({ month: 1 }).month).toEqual(undefined)
    expect(component.instance().checkValidity({ month: '12' }).month).toEqual(undefined)
    expect(component.instance().checkValidity({ month: 12 }).month).toEqual(undefined)
    expect(component.instance().checkValidity({ month: '13' }).month).toEqual(true)
  })

  it('Correctly validates year', ()=>{
    let component = shallow(<DatePicker onChange={function() {} }/>)
    expect(component.instance().checkValidity({ year: 'YYYY' }).year).toEqual(true)
    expect(component.instance().checkValidity({ year: '0' }).year).toEqual(undefined)
    expect(component.instance().checkValidity({ year: 0 }).year).toEqual(undefined)
    expect(component.instance().checkValidity({ year: '2000' }).year).toEqual(undefined)
    expect(component.instance().checkValidity({ year: 2000 }).year).toEqual(undefined)
    expect(component.instance().checkValidity({ year: '3000' }).year).toEqual(undefined)
    expect(component.instance().checkValidity({ year: 3000 }).year).toEqual(undefined)
  })
})