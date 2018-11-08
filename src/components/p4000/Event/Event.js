import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as p4000Actions from '../../../actions/p4000'

import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'

import './Event.css'

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Event extends Component {
  renderDate (date) {
    const { t } = this.props
    if (!date) {
      return t('ui:unknown')
    }
    let mm = date.getMonth() + 1 // getMonth() is zero-based
    let dd = date.getDate()
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('.')
  }

  render () {
    const { t, event, selected, onClick, mode } = this.props

    return <div className='c-p4000-event' title={selected ? t('p4000:form-cancelEditEvent') : t('p4000:form-editEvent')}>
      <div className='badgeLine'>&nbsp;</div>
      <Nav.Hovedknapp className={classNames('badge', { selected: selected && mode === 'edit' })} onClick={onClick}>
        { !_.isEmpty(event.files) ? <div className='badgeHasAttachments'>
          <Icons size={'sm'} kind='clip' />
        </div> : null}
        <Icons className='badgeIcon' size={'lg'} kind={event.type} />
        <div className='badgeDate'>
          <div>{this.renderDate(event.startDate)}</div>
          <div>{this.renderDate(event.endDate)}</div>
        </div>
      </Nav.Hovedknapp>
    </div>
  }
}

Event.propTypes = {
  t: PT.func.isRequired,
  event: PT.object.isRequired,
  selected: PT.bool.isRequired,
  onClick: PT.func.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(
  withNamespaces()(Event)
)
