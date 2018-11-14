import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreatableSelect from 'react-select/lib/Creatable'
import { components } from 'react-select'
import { setEventProperty } from '../../../actions/pinfo'
import * as Nav from '../../ui/Nav'

const mapStateToProps = (state) => {
  return {
    stringBuffer: state.pinfo.form.stringBuffer || ''
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStringBuffer: (s) => { dispatch(setEventProperty({ stringBuffer: s })) }
  }
}

const createOption = (label) => ({
  label,
  value: label
})

class CreatableInputOnly extends Component {
  state = {
    value: []
  };
  handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'clear') this.props.setStringBuffer('')
    console.log(value, actionMeta)
    this.setState({ value })
  };
  handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action !== 'input-change') return
    this.props.setStringBuffer(inputValue)
  };
  handleKeyDown = (event) => {
    const { value } = this.state
    let str = this.props.stringBuffer
    if (!str || value.reduce((acc, cur) => (acc || cur.value === str), false)) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.props.setStringBuffer('')
        this.setState({
          value: [...value, createOption(str)]
        })
        event.preventDefault()
        break
      default:
    }
  };

  onClick = (event) => {
    let { value } = this.state
    let str = this.props.stringBuffer
    if (!str || value.reduce((acc, cur) => (acc || cur.value === str), false)) return
    this.props.setStringBuffer('')
    this.setState({
      value: [...value, createOption(str)]
    })
    event.preventDefault()
  }

  IndicatorsContainer = (props) => {
    return (
      <div className='row'>
        <div className='col-sm-6' style={{ float: 'left' }}>
          <Nav.Flatknapp mini type='flat' htmlType='button' value='AddPhone' onClick={this.onClick}>phone</Nav.Flatknapp>
        </div>
        <div className='col-sm-6'>
          <components.IndicatorsContainer {...props} />
        </div>
      </div>
    )
  };

  render () {
    const { value } = this.state

    return (
      <CreatableSelect
        components={{ DropdownIndicator: null, IndicatorsContainer: this.IndicatorsContainer }}
        inputValue={this.props.stringBuffer}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder='Localization here'
        value={value}
        onBlurResetsInput={false}
        blurInputOnSelect={false}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatableInputOnly)
