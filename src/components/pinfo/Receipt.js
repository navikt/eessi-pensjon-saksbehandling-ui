import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'

import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}

class Receipt extends React.Component {
  render () {
    const { t } = this.props

    return <React.Fragment>
      <div>
      receipt
      </div>
    </React.Fragment>
  }
}

export default connect(
  mapStateToProps
)(withNamespaces(Receipt))
