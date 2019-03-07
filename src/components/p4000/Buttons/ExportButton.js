import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'

import * as routes from '../../../constants/routes'
import * as p4000Actions from '../../../actions/p4000'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class ExportButton extends Component {
    state = {}

    onExportRequest () {
      const { history } = this.props
      history.push(routes.P4000 + '/export')
    }

    render () {
      const { t, events, style } = this.props

      return <Nav.Knapp
        title={t('p4000:file-export-description-1')}
        style={style}
        className='bigButton exportP4000Button'
        disabled={_.isEmpty(events)}
        onClick={this.onExportRequest.bind(this)}>
        <div>
          <Icons className='mr-3' size='4x' kind='export' />
        </div>
        <div className='mt-3'>{t('export')}</div>
      </Nav.Knapp>
    }
}

ExportButton.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  style: PT.object,
  history: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(ExportButton)
)
