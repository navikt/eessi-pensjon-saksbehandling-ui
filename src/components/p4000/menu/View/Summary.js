import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'

import Icons from '../../../ui/Icons'
import File from '../../../ui/File/File'
import * as Nav from '../../../ui/Nav'

import * as p4000Actions from '../../../../actions/p4000'

import './Summary.css'
import '../Menu.css'

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
    const { t, events } = this.props

    return <Nav.Panel className='c-p4000-menu c-p4000-menu-summary p-0 mb-4'>
      <div className='title m-3'>
        <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
          <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
        </Nav.Knapp>
        <Icons size='3x' kind={'view'} className='float-left mr-4' />
        <h1 className='m-0'>{t('p4000:file-summary')}</h1>
      </div>
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
