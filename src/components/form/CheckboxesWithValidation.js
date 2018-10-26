import React from 'react'
import PT from 'prop-types'

import * as Nav from '../ui/Nav'

export default class CheckboxesWithValidation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checkboxStates: this.props.checkboxes.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.inputProps.defaultChecked }), {})
    }
    this.validate = this.validate.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  validate () {
    let valid = Object.values(this.state.checkboxStates).reduce((acc, cur) => acc || cur, false)
    if (valid) {
      this.props.active()
    } else {
      this.props.inactive()
    }
    this.props.action(this.state.checkboxStates)
  }

  onChange (e) {
    this.setState(
      {
        checkboxStates: {
          ...this.state.checkboxStates,
          [e.target.id]: e.target.checked
        }
      },
      this.validate
    )
  }

  render () {
    return <Nav.CheckboksPanelGruppe
      ref={this.state.child}
      onChange={this.onChange}
      {...this.props}
    />
  }
}

CheckboxesWithValidation.propTypes = {
  checkboxes: PT.array,
  active: PT.func,
  inactive: PT.func,
  action: PT.func,
  t: PT.func
}
