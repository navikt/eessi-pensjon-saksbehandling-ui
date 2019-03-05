import React from 'react'
import DatePicker from './DatePicker'

describe('DatePicker', () => {
  it('renders without crashing', () => {
    let wrapper = shallow(<DatePicker onChange={function () { }} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Correctly validates day', ()=>{
    let wrapper = shallow(<DatePicker onChange={function () { }}/>)
    expect(wrapper.instance().checkValidity({ day: 'DD' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '-1' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '0' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '10' }).day).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ day: 10 }).day).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ day: '50' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '31', month: '3' }).day).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ day: '31', month: '4' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '29', month: '2', year: '2001' }).day).toEqual(true)
    expect(wrapper.instance().checkValidity({ day: '29', month: '2', year: '2000' }).day).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ day: '28', month: '2', year: '2001' }).day).toEqual(undefined)
  })

  it('Correctly validates month', ()=>{
    let wrapper = shallow(<DatePicker onChange={function() {} }/>)
    expect(wrapper.instance().checkValidity({ month: 'MM' }).month).toEqual(true)
    expect(wrapper.instance().checkValidity({ month: '-1' }).month).toEqual(true)
    expect(wrapper.instance().checkValidity({ month: '0' }).month).toEqual(true)
    expect(wrapper.instance().checkValidity({ month: '1' }).month).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ month: 1 }).month).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ month: '12' }).month).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ month: 12 }).month).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ month: '13' }).month).toEqual(true)
  })

  it('Correctly validates year', ()=>{
    let wrapper = shallow(<DatePicker onChange={function() {} }/>)
    expect(wrapper.instance().checkValidity({ year: 'YYYY' }).year).toEqual(true)
    expect(wrapper.instance().checkValidity({ year: '0' }).year).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ year: 0 }).year).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ year: '2000' }).year).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ year: 2000 }).year).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ year: '3000' }).year).toEqual(undefined)
    expect(wrapper.instance().checkValidity({ year: 3000 }).year).toEqual(undefined)
  })

  it('Renders errors correctly', ()=>{
    let wrapper = shallow(<DatePicker onChange={function() {} }/>)
    
    expect(wrapper.exists({label: 'dag', feil: { feilmelding: '' } }) ).toEqual(false)
    expect(wrapper.exists({label: 'måned', feil: { feilmelding: '' } }) ).toEqual(false)
    expect(wrapper.exists({label: 'år', feil: { feilmelding: '' } }) ).toEqual(false)
    wrapper.setState({errors: {day: true, month: true, year: true}})
    expect(wrapper.exists({label: 'dag', feil: { feilmelding: '' } }) ).toEqual(true)
    expect(wrapper.exists({label: 'måned', feil: { feilmelding: '' } }) ).toEqual(true)
    expect(wrapper.exists({label: 'år', feil: { feilmelding: '' } }) ).toEqual(true)

    expect(wrapper.exists('.skjemaelement__feilmelding')).toEqual(false)
    wrapper.setProps({ onChange: function() {}, feil: {feilmelding: 'ERROR'} })
    expect(wrapper.exists('.skjemaelement__feilmelding')).toEqual(true)
    expect(wrapper.find('.skjemaelement__feilmelding').text()).toEqual('ERROR')
  })

  it('Sets state correctly', ()=>{
    let wrapper = shallow(<DatePicker onChange={function(){}} values={ {day:'1',month:'1',year:'1970'} }/>)
    wrapper.instance().dateChange('day', {target:{value: 'NaN'}})
    expect(wrapper.state().errors.day).toEqual(true)
    expect(wrapper.state().errors.month).toEqual(undefined)
    expect(wrapper.state().errors.year).toEqual(undefined)
    wrapper.instance().dateChange('month', {target:{value: 'NaN'}})
    expect(wrapper.state().errors.day).toEqual(undefined)
    expect(wrapper.state().errors.month).toEqual(true)
    expect(wrapper.state().errors.year).toEqual(undefined)
    wrapper.instance().dateChange('year', {target:{value: 'NaN'}})
    expect(wrapper.state().errors.day).toEqual(undefined)
    expect(wrapper.state().errors.month).toEqual(undefined)
    expect(wrapper.state().errors.year).toEqual(true)
  })

  it('Returns correct value', (done)=>{
    let wrapper = shallow(<DatePicker onChange={onChange} values={{day: '1', month: '1', year: '1970'}}/>)
    
    function onChange(value) {
      expect(value).toEqual(objectToTestAgainst)
      done()
    }

    let objectToTestAgainst
    
    objectToTestAgainst = {day: '31', month: '1', year: '1970'}
    wrapper.instance().dateChange('day', {target: {value: '31'}})

    objectToTestAgainst = {day: '1', month: '12', year: '1970'}
    wrapper.instance().dateChange('month', {target: {value: '12'}})

    objectToTestAgainst = {day: '1', month: '1', year: '2010'}
    wrapper.instance().dateChange('year', {target: {value: '2010'}})
  })
})