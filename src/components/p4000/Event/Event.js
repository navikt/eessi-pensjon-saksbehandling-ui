import React, { Component } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import * as p4000Actions from '../../../actions/p4000'
import { renderDate } from '../../../utils/Date'
import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'

import './Event.css'

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Event extends Component {
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
          <div>{renderDate(event.startDate, t)}</div>
          <div>{renderDate(event.endDate, t)}</div>
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

const ConnectedEvent = connect(
  () => {},
  mapDispatchToProps
)(
  withTranslation()(Event)
)

export default ConnectedEvent
