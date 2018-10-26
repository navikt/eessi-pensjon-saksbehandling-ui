import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'

import Icons from '../../../ui/Icons'
import File from '../../../ui/File/File'

import './Summary.css'
import '../Menu.css'

class SummaryRender extends Component {
  render () {
    const { t, events } = this.props

    return <div>
      {events.map((event, index) => {
        return <div key={index} style={{ animationDelay: (index * 0.03) + 's' }} className='event m-3 fieldset animate2'>
          <div className='eventTitle'>
            <Icons size='2x' kind={event.type} />
            <span className='ml-3 eventTitleText'>
              {event.startDate ? event.startDate.toLocaleDateString() : t('unknown')}
              {' - '}
              {event.endDate ? event.endDate.toLocaleDateString() : t('unknown')}
              {event.uncertainDate ? '*' : ''}
            </span>
            <img className='ml-3' title={event.country.label} alt={event.country.label}
              style={{ width: '30px', height: '20px' }} src={'../../../../flags/' + event.country.value + '.png'} />
            <span className='ml-3 eventTitleText'>
              {t('p4000:type-' + event.type)}
            </span>
          </div>
          {event.uncertainDate ? <div>* {t('p4000:form-uncertainDate')}</div> : null}
          {event.name ? <div><label>{event.type === 'learn' ? t('p4000:learn-fieldset-2_1-name') : t('p4000:work-fieldset-2_3-name')}</label>
            {': '}{event.name}</div> : null}
          {event.activity ? <div><label>{t('p4000:work-fieldset-2_1-activity')}</label>{': '}{event.activity}</div> : null}
          {event.id ? <div><label>{t('p4000:work-fieldset-2_2-id')}</label>{': '}{event.id}</div> : null}
          {event.address ? <div>
            <label>{t('p4000:work-fieldset-2_4-address')}</label>{': '}
            <div>{event.address}</div>
            <div>{event.city}</div>
            <div>{event.region}</div>
            <div>{event.country.label}</div>
          </div> : null}
          {event.birthDate ? <div>
            <label>{t('p4000:child-fieldset-2-info-title')}</label>{': '}
            {event.lastname}, {event.firstname} - {event.birthDate.toLocaleDateString()}
          </div> : null}
          {event.other ? <div><label>{t('comment')}</label>{': '}{event.other}</div> : null}
          {event.files ? <div>
            <label>{t('attachments')}: </label>
            <div>{event.files.map((file, i) => {
              return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink />
            })}</div>
          </div> : null }
        </div>
      })}
    </div>
  }
}

SummaryRender.propTypes = {
  t: PT.func,
  events: PT.array.isRequired
}

export default translate()(SummaryRender)
