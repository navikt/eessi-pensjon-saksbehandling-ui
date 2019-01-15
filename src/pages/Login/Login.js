import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as appActions from '../../actions/app'

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions), dispatch) }
}

class Login extends Component {
  componentDidMount (){
    console.log("No oidc-token, force login.")
    this.props.actions.login()
  }
  render () {
    return null
  }
}

Login.propTypes = {
  actions: PT.object.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
