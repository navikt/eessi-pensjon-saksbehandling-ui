import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import * as Nav from '../Nav'
import './ServerAlert.css'

const mapStateToProps = (state) => {
  return {
    serverErrorMessage: state.alert.serverErrorMessage
  }
}

class ServerAlert extends Component {
  render () {
    let { t, serverErrorMessage } = this.props

    return serverErrorMessage ? <Nav.AlertStripe
      className='c-ui-serverAlert' type='advarsel' solid>
      {t(serverErrorMessage)}
    </Nav.AlertStripe> : null
  }
}

ServerAlert.propTypes = {
  t: PT.func.isRequired,
  serverErrorMessage: PT.string
}

export default connect(
  mapStateToProps
)(
  translate()(ServerAlert)
)
