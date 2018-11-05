import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'
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

class SummaryButton extends Component {
  handleSummary () {
    const { history } = this.props
    history.push(routes.P4000 + '/summary')
  }

  render () {
    const { t, events, style } = this.props

    return <Nav.Knapp title={t('p4000:file-summary-description-1')}
      style={style} className='bigButton summaryP4000Button' onClick={this.handleSummary.bind(this)} disabled={_.isEmpty(events)}>
      <div>
        <Icons className='mr-3' size='4x' kind='file' />
        <Icons size='3x' kind='view' />
      </div>
      <div className='mt-3'>{t('p4000:file-summary')}</div>
    </Nav.Knapp>
  }
}

SummaryButton.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  style: PT.object,
  actions: PT.object,
  history: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(SummaryButton)
)
