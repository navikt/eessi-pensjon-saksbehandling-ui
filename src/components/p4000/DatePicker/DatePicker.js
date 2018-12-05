import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import Validation from '../Validation'
import * as Nav from '../../ui/Nav'
import * as p4000Actions from '../../../actions/p4000'

import './DatePicker.css'

const mapStateToProps = (state) => {
  return {
    event: state.p4000.event,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class DatePicker extends Component {
    state = {
      validationError: undefined
    };

    componentDidMount () {
      const { event, actions } = this.props

      if (!event.dateType) {
        // set initial state
        actions.setEventProperty('dateType', 'both')
      }
      this.props.provideController({
        hasNoValidationErrors: this.hasNoValidationErrors.bind(this),
        passesValidation: this.passesValidation.bind(this),
        resetValidation: this.resetValidation.bind(this)
      })
    }

    componentWillUnmount () {
      this.props.provideController(null)
    }

    hasNoValidationErrors () {
      return this.state.validationError === undefined
    }

    async resetValidation () {
      return new Promise(async (resolve, reject) => {
        try {
          this.setState({
            validationError: undefined
          }, () => {
            // after setting up state, use it to see the validation state
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    async passesValidation () {
      const { event } = this.props

      return new Promise((resolve, reject) => {
        try {
          this.setState({
            validationError: Validation.validateDatePicker(event.dateType, event)
          }, () => {
            // after setting up state, use it to see the validation state
            resolve(this.hasNoValidationErrors())
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    handlePeriodChange (e) {
      let { event, actions } = this.props
      let dateType = e.target.value

      actions.setEventProperty('dateType', dateType)
      if (dateType !== 'both' && event.endDate) {
        actions.setEventProperty('endDate', undefined)
      }
    }

    onStartDateChange (date) {
      const { event } = this.props

      if (!event.startDate || date.getTime() !== event.startDate.getTime()) {
        this.onStartDateHandle(date)
      }
    }

    onEndDateChange (date) {
      const { event } = this.props

      if (!event.endDate || date.getTime() !== event.endDate.getTime()) {
        this.onEndDateHandle(date)
      }
    }

    onStartDateHandle (date) {
      let { event, actions } = this.props
      let validationError

      if (event.dateType === 'both') {
        if (event.endDate && event.endDate < date) {
          validationError = 'p4000:validation-endDateEarlierThanStartDate'
        }
      }
      if (date > new Date()) {
        validationError = 'p4000:validation-startDateCantBeInFuture'
      }

      this.setState({
        validationError: validationError
      }, () => {
        actions.setEventProperty('startDate', date)
      })
    }

    onEndDateHandle (date) {
      let { event, actions } = this.props
      let validationError

      if (event.dateType === 'both') {
        if (event.startDate && event.startDate > date) {
          validationError = 'p4000:validation-endDateEarlierThanStartDate'
        }
      }
      if (date > new Date()) {
        validationError = 'p4000:validation-endDateCantBeInFuture'
      }

      this.setState({
        validationError: validationError
      }, () => {
        actions.setEventProperty('endDate', date)
      })
    }

    handleUncertainDateChange (e) {
      let { actions } = this.props
      actions.setEventProperty('uncertainDate', e.target.checked)
    }

    getToggle (dateType) {
      let { t } = this.props

      return <Nav.ToggleGruppe name='dateType' className='dateType' style={{ display: 'inline-flex' }} onChange={this.handlePeriodChange.bind(this)}>
        <Nav.ToggleKnapp value='both' checked={dateType === 'both'} key='1'>{t('p4000:form-rangePeriod')}</Nav.ToggleKnapp>
        <Nav.ToggleKnapp value='onlyStartDate01' checked={dateType === 'onlyStartDate01'} key='2'>{t('p4000:form-onlyStartDate01')}</Nav.ToggleKnapp>
        <Nav.ToggleKnapp value='onlyStartDate98' checked={dateType === 'onlyStartDate98'} key='3'>{t('p4000:form-onlyStartDate98')}</Nav.ToggleKnapp>
      </Nav.ToggleGruppe>
    }

    render () {
      let { t, event, locale } = this.props

      return <div className={classNames('c-p4000-datePicker', 'p-2')}>
        {!this.hasNoValidationErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.validationError)}</Nav.AlertStripe> : null}
        <Nav.Row className='row-datePicker-toggleButton no-gutters'>
          <Nav.Column className='text-center mb-4'>
            {this.getToggle(event.dateType)}
            <Nav.Checkbox className='d-inline-flex ml-4 mt-3 uncertainDate'
              label={t('p4000:form-uncertainDate')}
              checked={event.uncertainDate}
              onChange={this.handleUncertainDateChange.bind(this)} />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row className='row-datepickers no-gutters'>
          <Nav.Column className='text-center'>
            <label className='mr-3'>{t('ui:startDate') + ' *'}</label>
            <ReactDatePicker selected={event.startDate ? event.startDate : undefined}
              className='startDate'
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.onStartDateChange.bind(this)} />
            <div>{this.state.onStartDateFail}</div>
          </Nav.Column>
          <Nav.Column className='text-center'>
            <label className='mr-3'>{t('ui:endDate')}</label>
            <ReactDatePicker selected={event.endDate ? event.endDate : undefined}
              disabled={event.dateType !== 'both'}
              className='endDate'
              dateFormat='dd.MM.yyyy'
              placeholderText={t('ui:dateFormat')}
              showYearDropdown
              showMonthDropdown
              dropdownMode='select'
              locale={locale}
              onChange={this.onEndDateChange.bind(this)} />
            <div>{this.state.onEndDateFail}</div>
          </Nav.Column>
        </Nav.Row>
      </div>
    }
}

DatePicker.propTypes = {
  t: PT.func.isRequired,
  event: PT.object.isRequired,
  actions: PT.object.isRequired,
  provideController: PT.func.isRequired,
  locale: PT.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(DatePicker)
)
