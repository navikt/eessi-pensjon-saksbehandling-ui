import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import * as p4000Actions from '../../../../actions/p4000'
import * as appActions from '../../../../actions/app'

import FileUpload from '../../../ui/FileUpload/FileUpload'
import CountrySelect from '../../../ui/CountrySelect/CountrySelect'
import DatePicker from '../../DatePicker/DatePicker'
import Validation from '../../Validation'
import * as Nav from '../../../ui/Nav'
import Icons from '../../../ui/Icons'

import * as routes from '../../../../constants/routes'

import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    event: state.p4000.event,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, p4000Actions), dispatch) }
}

class GenericEvent extends Component {
    state = {}

    componentDidMount () {
      const { actions, history, event, provideController } = this.props
      if (!event) {
        history.replace(routes.P4000)
      }

      provideController({
        hasNoValidationErrors: this.hasNoValidationErrors.bind(this),
        passesValidation: this.passesValidation.bind(this),
        resetValidation: this.resetValidation.bind(this)
      })

      actions.registerDroppable('fileUpload', this.fileUpload)
      window.scrollTo(0, 0)
    }

    componentWillUnmount () {
      const { actions, provideController } = this.props

      provideController(null)
      actions.unregisterDroppable('fileUpload')
    }

    hasNoOtherErrors () {
      return this.state.otherValidationError === undefined
    }

    hasNoValidationErrors () {
      return this.hasNoOtherErrors() && this.datepicker ? this.datepicker.hasNoValidationErrors() : undefined
    }

    async resetValidation () {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.datepicker) {
            await this.datepicker.resetValidation()
          }
          this.setState({
            otherValidationError: undefined
          }, () => {
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    async passesValidation () {
      const { event } = this.props

      return new Promise(async (resolve, reject) => {
        try {
          if (this.datepicker) {
            await this.datepicker.passesValidation()
          }

          this.setState({
            otherValidationError: Validation.validateOther(event)
          }, () => {
            resolve(this.hasNoValidationErrors())
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    handleFileChange (files) {
      const { actions } = this.props
      actions.setEventProperty('files', files)
    }

    onBackButtonClick () {
      const { actions, history, mode, eventIndex } = this.props
      if (mode === 'edit') {
        actions.cancelEditEvent(eventIndex)
      }
      history.goBack()
    }

    render () {
      const { t, event, mode, actions, type, locale } = this.props

      if (!event) {
        return null
      }
      return <Nav.Panel className={classNames('c-p4000-menu p-0 mb-4', { editMode: mode === 'edit' })}>
        <div className='title m-4'>
          <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
            <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
          </Nav.Knapp>
          <Icons size='3x' kind={type} className='float-left mr-4' />
          <h1 className='typo-sidetittel  m-0'>{ mode !== 'edit' ? t('ui:new') : t('ui:edit')} {t('p4000:' + type + '-title')}</h1>
        </div>
        <Nav.Row className='eventDescription mb-4 fieldset'>
          <Nav.Column>
            <Nav.Ikon className='float-left mr-4' kind='info-sirkel-fyll' />
            <Nav.Tekstomrade>{t('p4000:' + type + '-description')}</Nav.Tekstomrade>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row className={classNames('eventDates', 'mb-4', 'fieldset', {
          validationFail: this.datepicker ? !this.datepicker.hasNoValidationErrors() : false
        })}>
          <Nav.Column>
            <Nav.HjelpetekstBase>{t('p4000:help-' + type + '-dates')}</Nav.HjelpetekstBase>
            <h2 className='typo-undertittel mb-3'>{t('p4000:' + type + '-fieldset-1-dates-title')}</h2>
            <DatePicker provideController={(datepicker) => { this.datepicker = datepicker }} />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row className={classNames('eventOther', 'mb-4', 'fieldset', {
          validationFail: this ? !this.hasNoOtherErrors() : false
        })}>
          <Nav.Column>
            <h2 className='typo-undertittel mb-3'>{t('p4000:' + type + '-fieldset-2-other-title')}</h2>
            {!this.hasNoOtherErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.otherValidationError)}</Nav.AlertStripe> : null}
            <div className='mb-3'>
              <div>
                <label>{t('ui:country') + ' *'}</label>
              </div>
              <CountrySelect className='countrySelect' locale={locale} value={event.country || {}}
                onSelect={(e) => {
                  actions.setEventProperty('country', e)
                }
                } />
            </div>
            <Nav.Textarea id='other' style={{ minHeight: '200px' }} label={t('p4000:' + type + '-fieldset-2_1-other')} value={event.other || ''}
              onChange={(e) => { actions.setEventProperty('other', e.target.value) }} />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row className={classNames('eventFileUpload', 'mb-4', 'fieldset')}>
          <Nav.Column>
            <h2 className='typo-undertittel mb-3'>{t('ui:fileUpload')}</h2>
            <FileUpload t={t} ref={f => { this.fileUpload = f }} fileUploadDroppableId={'fileUpload'} className='fileUpload'
              files={event.files || []} onFileChange={this.handleFileChange.bind(this)} />
          </Nav.Column>
        </Nav.Row>
      </Nav.Panel>
    }
}

GenericEvent.propTypes = {
  t: PT.func.isRequired,
  event: PT.object.isRequired,
  eventIndex: PT.number,
  type: PT.string.isRequired,
  mode: PT.string,
  actions: PT.object.isRequired,
  provideController: PT.func.isRequired,
  locale: PT.string.isRequired

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(GenericEvent)
)
