import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'
import _ from 'lodash'

import PsychoPanel from '../../../ui/Psycho/PsychoPanel'
import * as Nav from '../../../ui/Nav'
import Icons from '../../../ui/Icons'
import SubmitButton from '../../Buttons/SubmitButton'
import ExportButton from '../../Buttons/ExportButton'
import OpenFromServerButton from '../../Buttons/OpenFromServerButton'
import SaveToServerButton from '../../Buttons/SaveToServerButton'
import TimelineButton from '../../Buttons/TimelineButton'
import SummaryButton from '../../Buttons/SummaryButton'
import NewButton from '../../Buttons/NewButton'

import * as UrlValidator from '../../../../utils/UrlValidator'
import * as routes from '../../../../constants/routes'
import * as p4000Actions from '../../../../actions/p4000'
import * as uiActions from '../../../../actions/ui'

import './Index.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    event: state.p4000.event,
    comment: state.p4000.comment,
    rinaId: state.app.params.rinaId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch) }
}

const eventList = [
  { label: 'p4000:type-work', description: 'p4000:type-work-description', value: 'work', icon: 'work' },
  { label: 'p4000:type-home', description: 'p4000:type-home-description', value: 'home', icon: 'home' },
  { label: 'p4000:type-child', description: 'p4000:type-child-description', value: 'child', icon: 'child' },
  { label: 'p4000:type-voluntary', description: 'p4000:type-voluntary-description', value: 'voluntary', icon: 'voluntary' },
  { label: 'p4000:type-military', description: 'p4000:type-military-description', value: 'military', icon: 'military' },
  { label: 'p4000:type-birth', description: 'p4000:type-birth-description', value: 'birth', icon: 'birth' },
  { label: 'p4000:type-learn', description: 'p4000:type-learn-description', value: 'learn', icon: 'learn' },
  { label: 'p4000:type-daily', description: 'p4000:type-daily-description', value: 'daily', icon: 'daily' },
  { label: 'p4000:type-sick', description: 'p4000:type-sick-description', value: 'sick', icon: 'sick' },
  { label: 'p4000:type-other', description: 'p4000:type-other-description', value: 'other', icon: 'other' }
]

class New extends Component {
    state = {
      submitted: false
    }

    handleEventSelect (newPage) {
      const { history } = this.props
      history.push(routes.P4000 + '/' + newPage)
    }

    componentDidMount () {
      const { location } = this.props

      this.props.provideController({
        hasNoValidationErrors: this.hasNoValidationErrors.bind(this),
        passesValidation: this.passesValidation.bind(this),
        resetValidation: this.resetValidation.bind(this)
      })
      window.scrollTo(0, 0)
    }

    componentDidUpdate () {
      const { history, rinaId } = this.props

      if (this.state.submitted && rinaId) {
        history.push(routes.ROOT + '?rinaId=' + rinaId)
      }
    }

    hasNoValidationErrors () {
      return true
    }

    resetValidation () {
      return new Promise((resolve) => {
        resolve()
      })
    }

    passesValidation () {
      return new Promise((resolve) => {
        resolve()
      })
    }

    setComment (e) {
      const { actions } = this.props
      actions.setComment(e.target.value)
    }

    render () {
      const { t, history, event, events, comment } = this.props

      let fileMenuDelay = event !== undefined ? 0.5 : 0

      return <Nav.Panel className='c-p4000-menu-new mb-4 p-0'>

        {event !== undefined ? <React.Fragment>
          <div className='fieldset animate mb-4 c-p4000-menu-new-events'>
            <h2 className='m-0 mb-4'>{t('ui:new') + ' ' + t('p4000:type-event')}</h2>
            <div className='mt-5 mb-5'>
              <PsychoPanel closeButton>{t('p4000:help-new-event')}</PsychoPanel>
            </div>
            <div className='bigButtons'>
              {eventList.map((e, index) => {
                let count = _.filter(events, (event) => { return event.type === e.value }).length
                return <Nav.Knapp style={{ animationDelay: index * 0.03 + 's' }}
                  title={t(e.description)} className={classNames('bigButton', e.value + 'Button')}
                  key={e.value} onClick={this.handleEventSelect.bind(this, e.value)}>
                  <div>
                    <Icons size='4x' kind={e.icon} />
                  </div>
                  <div className='mt-3'>{t(e.label)}</div>
                  { count > 0 ? <div title={t('p4000:numberOfEvents')} className='notification'>{count}</div> : null }
                </Nav.Knapp>
              })}
            </div>
          </div>
          <div style={{ animationDelay: '0.3s' }} className='fieldset animate mb-4 c-p4000-menu-new-comment'>
            <h1 className='typo-sidetittel m-0 mb-4'>{t('comment')}</h1>
            <Nav.Textarea label={t('comment')} value={comment || ''}
              style={{ minHeight: '150px' }}
              onChange={this.setComment.bind(this)} />
          </div>
        </React.Fragment> : null}

        <div style={{ animationDelay: fileMenuDelay + 's' }}
          className='fieldset animate c-p4000-menu-new-menu'>
          <h2>{t('p4000:file-menu')}</h2>
          <div className='mt-5 mb-5'>
            <PsychoPanel closeButton>{t('p4000:help-new-options')}</PsychoPanel>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <NewButton style={{ animationDelay: (fileMenuDelay + 0.03) + 's' }} />
            <OpenFromServerButton style={{ animationDelay: (fileMenuDelay + 0.06) + 's' }} />
            <SaveToServerButton style={{ animationDelay: (fileMenuDelay + 0.09) + 's' }} />
            <TimelineButton history={history} style={{ animationDelay: (fileMenuDelay + 0.12) + 's' }} />
            <SummaryButton history={history} style={{ animationDelay: (fileMenuDelay + 0.15) + 's' }} />
            <ExportButton history={history} style={{ animationDelay: (fileMenuDelay + 0.18) + 's' }} />
            <SubmitButton style={{ animationDelay: (fileMenuDelay + 0.21) + 's' }} />
          </div>
        </div>
      </Nav.Panel>
    }
}

New.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  history: PT.object.isRequired,
  provideController: PT.func.isRequired,
  event: PT.object,
  location: PT.object.isRequired,
  rinaId: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(New)
)
