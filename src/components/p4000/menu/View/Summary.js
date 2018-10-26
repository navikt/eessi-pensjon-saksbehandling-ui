import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import Icons from '../../../ui/Icons'
import P4000Util from '../../../p4000/Util'
import * as Nav from '../../../ui/Nav'

import * as p4000Actions from '../../../../actions/p4000'

import './Summary.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Summary extends Component {

    onBackButtonClick () {
      const { actions } = this.props

      actions.setPage('new')
    }

    render () {
      const { t, events, actions } = this.props

      return <Nav.Panel className='c-p4000-menu-summary p-0 mb-4'>
        <div>
          <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
            <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
          </Nav.Knapp>
        </div>
        <h1>{t('p4000:form-summary')}</h1>
        {JSON.stringify(events)}
      </Nav.Panel>
    }
}

Summary.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Summary)
)
