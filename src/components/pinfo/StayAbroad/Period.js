import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { stayAbroadValidation } from '../Validation/singleTests'
import * as Nav from '../../ui/Nav'

class Period extends React.Component {
  state = {
    error: {},
    _period: {}
  }

  constructor (props) {
    super(props)
    this.setType = this.eventSetProperty.bind(this, 'type', null)
    this.setStartDate = this.dateSetProperty.bind(this, 'startDate', null)
    this.setEndDate = this.dateSetProperty.bind(this, 'endDate', null)
    this.setCountry = this.valueSetProperty.bind(this, 'country', null)
    this.setAttachments = this.valueSetProperty.bind(this, 'attachments', null)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  dateSetProperty (key, validateFunction, date) {
    this.valueSetProperty(key, validateFunction, date ? date.valueOf() : null)
  }

  valueSetProperty (key, validateFunction, value) {
    this.setState({
      _period: {
        ...this.state._period,
        [key]: value
      },
      error: {
        ...this.state.error,
        [key]: validateFunction ? validateFunction(value) : ''
      }
    })
  }

  static getDerivedStateFromProps (newProps, oldState) {
    if (_.isEmpty(oldState._period) && newProps.mode === 'edit') {
      return {
        _period: newProps.period
      }
    }
    return null
  }

  addPeriod () {
    const { periods, setStayAbroad } = this.props
    const { _period } = this.state

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)

    newPeriod.id = new Date().getTime()
    newPeriods.push(newPeriod)
    setStayAbroad(newPeriods)
    this.setState({
      error: {},
      period: {}
    })
  }

  requestEditPeriod (period) {

    const { editPeriod } = this.props

    editPeriod(period)
  }

  saveEditPeriod () {
    const { periods, setStayAbroad } = this.props
    const { _period } = this.state

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)
    newPeriod.id = new Date().getTime()

    let index = _.find(periods, { id: _period.id })

    if (index >= 0) {
      newPeriods.splice(index, 1)
      newPeriods.push(newPeriod)
      setStayAbroad(newPeriods)
      this.setState({
        error: {},
        period: {}
      })
    }
  }

  removePeriod (period) {
    const { periods, setStayAbroad } = this.props

    let index = _.find(periods, { id: period.id })

    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      setStayAbroad(newPeriods)
    }
  }

  render () {
    const { value, t, mode, period, editPeriod } = this.props
    const { error, _period } = this.state

    switch (mode) {
      case 'view':
        return <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
          <div className='col-md-4'>
            {period.id}
          </div>
          <div className='col-md-4'>
            <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.requestEditPeriod.bind(this, period)} mini>
              {t('ui:edit')}
            </Nav.Knapp>
            <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removePeriod.bind(this, period)} mini>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div>
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
            <div className='col-md-4'>
              <Nav.Select label={t('pinfo:stayAbroad-category')}
                value={_period.type || ''}
                onChange={this.setType}>
                <option value=''>{t('ui:choose')}</option>
                <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>
                <option value='child'>{t('pinfo:stayAbroad-category-child')}</option>
                <option value='voluntary'>{t('pinfo:stayAbroad-category-voluntary')}</option>
                <option value='military'>{t('pinfo:stayAbroad-category-military')}</option>
                <option value='child'>{t('pinfo:stayAbroad-category-child')}</option>
                <option value='learn'>{t('pinfo:stayAbroad-category-learn')}</option>
                <option value='daily'>{t('pinfo:stayAbroad-category-daily')}</option>
                <option value='sick'>{t('pinfo:stayAbroad-category-sick')}</option>
                <option value='other'>{t('pinfo:stayAbroad-category-other')}</option>
              </Nav.Select>
            </div>
          </Nav.Row>
          { _period.type ? <Nav.Row>
            <div className='col-md-4'>
              <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addPeriod.bind(this)} mini>
                {t('ui:savePeriod')}
              </Nav.Knapp>
            </div>
          </Nav.Row> : null}
        </React.Fragment>
    }
  }
}

Period.propTypes = {
  period: PT.object,
  periods: PT.array,
  setStayAbroad: PT.func.isRequired,
  editPeriod: PT.func.isRequired,
  t: PT.func
}

export default Period
