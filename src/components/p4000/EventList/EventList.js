import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { withTranslation } from 'react-i18next'

import Event from '../Event/Event'
import './EventList.css'

class EventList extends Component {
  render () {
    const { t, mode, events, eventIndex, handleEditRequest, cancelEditRequest, className } = this.props

    if (_.isEmpty(events)) {
      return null
    }

    return <div className={classNames('c-p4000-eventList', 'mb-4', className)}>
      <div className='ml-2 mt-1'>{t('p4000:form-eventsSoFar')}</div>
      <div className='eventList'>
        {events.map((event, index) => {
          let selected = (eventIndex !== undefined && eventIndex === index)
          return <Event key={index}
            onClick={() => selected ? cancelEditRequest(event, index) : handleEditRequest(event, index)}
            event={event}
            mode={mode}
            eventIndex={index}
            selected={selected} />
        })}
      </div>
    </div>
  }
}

EventList.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  eventIndex: PT.number,
  className: PT.string,
  handleEditRequest: PT.func.isRequired,
  cancelEditRequest: PT.func.isRequired
}

export default withTranslation()(EventList)
