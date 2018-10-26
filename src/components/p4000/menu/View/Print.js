import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'

import Icons from '../../../ui/Icons'

import * as Nav from '../../../ui/Nav'
import PrintUtils from '../../../ui/Print/PrintUtils'

import * as p4000Actions from '../../../../actions/p4000'

import './Print.css'
import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Print extends Component {
  onBackButtonClick () {
    const { actions } = this.props

    actions.setPage('new')
  }

  onPrintRequest () {
    const { events } = this.props

    PrintUtils.print({
      content: '<div>' + JSON.stringify(events) + '</div>',
      useCanvas: false
    })
  }

  render () {
    const { t } = this.props

    return <Nav.Panel className='c-p4000-menu c-p4000-menu-print p-0 mb-4'>
      <div className='title m-4'>
        <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
          <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
        </Nav.Knapp>
        <Icons size='3x' kind={'print'} className='float-left mr-4' />
        <h1>{t('p4000:file-print')}</h1>
      </div>

        Print
    </Nav.Panel>
  }
}

Print.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Print)
)
