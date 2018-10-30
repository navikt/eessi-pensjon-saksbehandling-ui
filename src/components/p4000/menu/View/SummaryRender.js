import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import className from 'classnames'

import * as constants from '../../../../constants/constants'

import Icons from '../../../ui/Icons'
import File from '../../../ui/File/File'

import './Summary.css'
import '../Menu.css'

class SummaryRender extends Component {
  render () {
    const { t, events, comment, animate, previewAttachments, blackAndWhite, username } = this.props

    let _animate = animate !== undefined ? animate : true

    return <div>
      <div>
        <h4 className='text-center'>{constants.P4000}</h4>
        <h5 className='text-center'>{username}</h5>
      </div>
      {events.map((event, index) => {
        return <div key={index} style={{ animationDelay: (index * 0.03) + 's' }}
          className={className('event m-3', { fieldset: !blackAndWhite, bwfieldset: blackAndWhite, slideAnimate: _animate })}>
          <div className='eventTitle eventTitleText'>
            <Icons size='2x' style={{ width: '16px', height: '16px' }} kind={event.type} />
            <span className='ml-3'>
              {event.startDate ? event.startDate.toLocaleDateString() : t('unknown')}
              {' - '}
              {event.endDate ? event.endDate.toLocaleDateString() : t('unknown')}
              {event.uncertainDate ? '*' : ''}
            </span>
            { !blackAndWhite ? <img className='ml-3' title={event.country.label} alt={event.country.label}
              style={{ width: '30px', height: '20px' }} src={'../../../../flags/' + event.country.value + '.png'} />
              : <span className='ml-3'>{event.country.label}</span> }
            <span className='ml-3'>
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
          {previewAttachments && event.files ? <div>
            <label>{t('attachments')}: </label>
            <div>{event.files.map((file, i) => {
              return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink />
            })}</div>
          </div> : null}
        </div>
      })}
      <div>
        <label>{t('comment')}</label>: {comment}
      </div>
    </div>
  }
}

SummaryRender.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  comment: PT.string,
  username: PT.string.isRequired,
  animate: PT.bool.isRequired,
  previewAttachments: PT.bool.isRequired,
  blackAndWhite: PT.bool.isRequired
}

export default translate()(SummaryRender)
