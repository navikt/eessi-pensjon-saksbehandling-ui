import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'

import * as p4000Actions from '../../../actions/p4000'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class PrintButton extends Component {
    state = {}

    onPrintRequest () {
      const { actions } = this.props

      actions.setPage('print')
    }

    render () {
      const { t, events, style } = this.props

      return <Nav.Knapp
        title={t('p4000:file-print-description-1')}
        style={style}
        className='bigButton printP4000Button'
        disabled={_.isEmpty(events)}
        onClick={this.onPrintRequest.bind(this)}>
        <div>
          <Icons className='mr-3' size='4x' kind='document' />
          <Icons size='3x' kind='print' />
        </div>
        <div className='mt-3'>{t('print')}</div>
      </Nav.Knapp>
    }
}

PrintButton.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  style: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(PrintButton)
)
