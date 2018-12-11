import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import PsychoPanel from '../../components/ui/Psycho/PsychoPanel'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import CountrySelect from '../../components/ui/CountrySelect/CountrySelect'
import FrontPageDrawer from '../../components/drawer/FrontPage'

import * as routes from '../../constants/routes'
import * as pselvActions from '../../actions/pselv'
import * as uiActions from '../../actions/ui'

import './PSelv.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    step: state.pselv.step,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pselvActions, uiActions), dispatch) }
}

class PSelv extends Component {
    state = {
      isLoaded: false,
      referrer: undefined,
      validationError: undefined
    };

    componentDidMount () {
      const { location, actions, history, step } = this.props

      this.setState({
        isLoaded: true,
        referrer: new URLSearchParams(location.search).get('referrer')
      }, () => {
        if (this.state.referrer === 'pinfo' && step === 3) {
          actions.stepForward()
          // clean the referrer param. ComponentDidMount will run again
          history.push(routes.PSELV)
        }
      })
    }

    async onBackButtonClick () {
      const { actions } = this.props

      await this.resetValidation()
      actions.stepBack()
    }

    goToP4000 () {
      const { actions, history } = this.props

      actions.closeModal()
      history.push(routes.P4000 + '?referrer=pselv')
    }

    goToPInfo () {
      const { actions, history } = this.props

      actions.closeModal()
      history.push(routes.PINFO + '?referrer=pselv')
    }

    closeModal () {
      const { actions } = this.props

      actions.closeModal()
    }

    async onForwardButtonClick () {
      const { t, actions, step } = this.props

      let valid = await this.passesValidation()

      if (valid) {
        if (step === 0 && this.state.livedOrWorkedOutsideNorway === true) {
          actions.openModal({
            modalTitle: t('leavingpage'),
            modalText: t('you will leave this page and continue on p4000'),
            modalButtons: [{
              main: true,
              text: t('ui:yes') + ', ' + t('ui:continue'),
              onClick: this.goToP4000.bind(this)
            }, {
              text: t('ui:no') + ', ' + t('ui:cancel'),
              onClick: this.closeModal.bind(this)
            }]
          })
        } else if (step === 3) {
          actions.openModal({
            modalTitle: t('leavingpage'),
            modalText: t('you will leave this page and continue on pinfo'),
            modalButtons: [{
              main: true,
              text: t('ui:yes') + ', ' + t('ui:continue'),
              onClick: this.goToPInfo.bind(this)
            }, {
              text: t('ui:no') + ', ' + t('ui:cancel'),
              onClick: this.closeModal.bind(this)
            }]
          })
        } else {
          actions.stepForward()
        }
      }
    }

    onSaveButtonClick () {
      console.log(this.getFormData())
    }

    async resetValidation () {
      return new Promise(async (resolve) => {
        this.setState({
          validationError: undefined
        }, () => {
          resolve()
        })
      })
    }

    hasNoValidationErrors () {
      return this.state.validationError === undefined
    }

    hasValidationErrors () {
      return !this.hasNoValidationErrors()
    }

    getFormData () {
      let data = _.clone(this.state)

      delete data.validationError
      delete data.isLoaded

      return data
    }

    async passesValidation () {
      let validation

      return new Promise(async (resolve) => {
        this.setState({
          validationError: validation
        }, () => {
          resolve(this.hasNoValidationErrors())
        })
      })
    }

    onDateChange (key, date) {
      if (!this.state[key] || date.getTime() !== this.state[key].getTime()) {
        this.onDateHandle(key, date)
      }
    }

    onDateHandle (key, date) {
      this.setState({
        [key]: date
      })
    }

    setValue (key, e) {
      let value = e.target ? e.target.value : e
      let newState = {
        [key]: value
      }

      if (key === 'citizenshipNorway') {
        if (value === true) {
          newState.citizenshipCountry = undefined
          newState.refugee = undefined
        } else {
          newState.bankAccount = undefined
        }
      }
      this.setState(newState)
    }

    render () {
      const { t, locale, history, step, location, status } = this.props

      if (!this.state.isLoaded) {
        return null
      }

      return <TopContainer className='p-pSelv'
        history={history} location={location}
        sideContent={<FrontPageDrawer t={t} status={status} />}>
        <Nav.Row className='mb-4'>
          <Nav.Column>
            <h1 className='typo-sidetittel ml-0 appTitle'>{t('pselv:app-title')}</h1>
            <Nav.Stegindikator
              aktivtSteg={step}
              visLabel
              onBeforeChange={() => { return false }}
              autoResponsiv
              steg={[
                { label: t('pselv:form-step0') },
                { label: t('pselv:form-step1') },
                { label: t('pselv:form-step2') },
                { label: t('pselv:form-step3') },
                { label: t('pselv:form-step4') },
                { label: t('pselv:form-step5') }
              ]} />
          </Nav.Column>
        </Nav.Row>
        <div className={classNames('fieldset', 'animate', 'mb-4', {
          validationFail: this ? this.hasValidationErrors() : false
        })}>
          {this.hasValidationErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.validationError)}</Nav.AlertStripe> : null}
          <div className='mb-4'>
            <h2 className='typo-undertittel'>{t('pselv:form-step' + step + '-title')}</h2>
            <div className='mb-5 mt-5'>
              <PsychoPanel closeButton>{t('pselv:form-step' + step + '-description')}
                {step === 3 ? <div><a href='#externalhref'>{t('pselv:form-step3-sed-anchor-text')}</a></div> : null}
              </PsychoPanel>
            </div>
          </div>
          {step === 0 ? <div className='mb-4'>
            <div>
              <label>{t('pselv:form-step0-radio-label') + ' *'}</label>
            </div>
            <Nav.Radio className='d-inline-block mr-4' label={t('yes')}
              checked={this.state.livedOrWorkedOutsideNorway === true}
              name='livedOrWorkedOutsideNorway'
              onChange={this.setValue.bind(this, 'livedOrWorkedOutsideNorway', true)} />
            <Nav.Radio className='d-inline-block' label={t('no')}
              checked={this.state.livedOrWorkedOutsideNorway === false}
              name='livedOrWorkedOutsideNorway'
              onChange={this.setValue.bind(this, 'livedOrWorkedOutsideNorway', false)} />
          </div> : null }
          {step === 1 ? <React.Fragment>
            <div className='mb-4'>
              <label>{t('pselv:form-step1-startPensionDate') + ' *'}</label>
              <ReactDatePicker selected={this.state.startPensionDate}
                dateFormat='dd.MM.yyyy'
                placeholderText={t('ui:dateFormat')}
                showYearDropdown
                showMonthDropdown
                dropdownMode='select'
                locale={locale}
                onChange={this.onDateChange.bind(this, 'startPensionDate')} />
            </div>
            <div className='mb-4'>
              <Nav.Select label={t('pselv:form-step1-grade') + ' *'} value={this.state.grade || ''}
                onChange={this.setValue.bind(this, 'grade')}>
                <option value=''>{'--'}</option>
                <option value='100%'>{'100 %'}</option>
                <option value='90%'>{'90 %'}</option>
                <option value='80%'>{'80 %'}</option>
                <option value='70%'>{'70 %'}</option>
                <option value='60%'>{'60 %'}</option>
                <option value='50%'>{'50 %'}</option>
              </Nav.Select>
            </div>
            <div className='mb-4'>
              <div>
                <label>{t('pselv:form-step1-afp') + ' *'}</label>
              </div>
              <Nav.Radio className='d-inline-block mr-4' label={t('yes')}
                checked={this.state.afp === true}
                name='afp'
                onChange={this.setValue.bind(this, 'afp', true)} />
              <Nav.Radio className='d-inline-block mr-4' label={t('no')}
                checked={this.state.afp === false}
                name='afp'
                onChange={this.setValue.bind(this, 'afp', false)} />
            </div>
          </React.Fragment> : null }
          {step === 2 ? <React.Fragment>
            <Nav.Row>
              <div className='mb-4 col-md-6'>
                <Nav.Input label={t('ui:name') + ' *'} value={this.state.name || ''}
                  onChange={this.setValue.bind(this, 'name')} />
              </div>
              <div className='mb-4 col-md-6'>
                <Nav.Input label={t('ui:idNumber') + ' *'} value={this.state.idNumber || ''}
                  onChange={this.setValue.bind(this, 'idNumber')} />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mb-4 col-md-6'>
                <Nav.Textarea label={t('ui:address') + ' *'} value={this.state.address || ''}
                  style={{ minHeight: '150px' }}
                  onChange={this.setValue.bind(this, 'address')} />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mb-4 col-md-4'>
                <div>
                  <label>{t('pselv:form-step2-citizenship') + ' *'}</label>
                </div>
                <Nav.Radio className='d-inline-block mr-4' label={t('ui:norway')}
                  checked={this.state.citizenshipNorway === true}
                  name='citizenshipNorway'
                  onChange={this.setValue.bind(this, 'citizenshipNorway', true)} />
                <Nav.Radio className='d-inline-block' label={t('ui:other')}
                  checked={this.state.citizenshipNorway === false}
                  name='citizenshipNorway'
                  onChange={this.setValue.bind(this, 'citizenshipNorway', false)} />
              </div>
              <div className='mb-4 col-md-4'>
                { this.state.citizenshipNorway === false ? <div>
                  <label>{t('pselv:form-step2-selectCountry') + ' *'}</label>
                  <CountrySelect className='countrySelect' locale={locale} value={this.state.citizenshipCountry || {}}
                    onSelect={this.setValue.bind(this, 'citizenshipCountry')} />
                </div> : null }
              </div>
              <div className='mb-4 col-md-4'>
                { this.state.citizenshipNorway === false ? <div>
                  <div>
                    <label>{t('pselv:form-step2-refugee')}</label>
                  </div>
                  <Nav.Radio className='d-inline-block mr-4' label={t('ui:yes')}
                    checked={this.state.refugee === true}
                    name='refugee'
                    onChange={this.setValue.bind(this, 'refugee', true)} />
                  <Nav.Radio className='d-inline-block' label={t('ui:no')}
                    checked={this.state.refugee === false}
                    name='refugee'
                    onChange={this.setValue.bind(this, 'refugee', false)} />
                </div>
                  : null }
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mb-4 col-md-6'>
                <Nav.Input label={t('pselv:form-step2-bankAccount')} value={this.state.bankAccount || ''}
                  disabled={!this.state.citizenshipNorway}
                  onChange={this.setValue.bind(this, 'bankAccount')} />
              </div>
              <div className='mb-4 col-md-6'>
                <Nav.Select label={t('pselv:form-step2-language')} value={this.state.language || ''}
                  onChange={this.setValue.bind(this, 'language')}>
                  <option value=''>{'--'}</option>
                  <option value='nb'>{'Norsk Bokmål'}</option>
                  <option value='nn'>{'Nynorsk'}</option>
                  <option value='en-gb'>{'English'}</option>
                </Nav.Select>
              </div>
            </Nav.Row>
            <h5>{t('pselv:form-step2-phonePreferences')}</h5>
            <Nav.Row>
              <div className='mb-4 col-md-4'>
                <Nav.Input label={t('pselv:form-step2-phone-mobile')} value={this.state.phonemobile || ''}
                  onChange={this.setValue.bind(this, 'phonemobile')} />
              </div>
              <div className='mb-4 col-md-4'>
                <Nav.Input label={t('pselv:form-step2-phone-home')} value={this.state.phonehome || ''}
                  onChange={this.setValue.bind(this, 'phonehome')} />
              </div>
              <div className='mb-4 col-md-4'>
                <Nav.Input label={t('pselv:form-step2-phone-work')} value={this.state.phonework || ''}
                  onChange={this.setValue.bind(this, 'phonework')} />
              </div>
            </Nav.Row>
          </React.Fragment> : null }

          { step === 3 ? <React.Fragment>
            <Nav.Row>
              <Nav.Column className='col-md-6 mb-4'>
                <h4>{t('pselv:form-step3-civilstatus-title')}</h4>
                <Nav.Select label={t('pselv:form-step3-civilstatus')} value={this.state.civilstatus || ''}
                  onChange={this.setValue.bind(this, 'civilstatus')}>
                  <option value=''>{'--'}</option>
                  <option value='single'>{'Single'}</option>
                  <option value='samboer'>{'Samboer'}</option>
                  <option value='married'>{'Married'}</option>
                  <option value='divorced'>{'Divorced'}</option>
                  <option value='widow'>{'Widow'}</option>
                </Nav.Select>
                <div>{t('pselv:form-step3-civilstatus-description')}</div>
              </Nav.Column>
            </Nav.Row>
            {this.state.civilstatus === 'widow' ? <h5>{t('pselv:form-step3-deceased-title')}</h5> : null }
            {this.state.civilstatus === 'widow' ? <Nav.Row>
              <div className='col-md-6 mb-4'>
                <Nav.Input label={t('pselv:form-step3-deceased-name')} value={this.state.deceasedName || ''}
                  onChange={this.setValue.bind(this, 'deceasedName')} />
              </div>
              <div className='col-md-6 mb-4'>
                <Nav.Input label={t('pselv:form-step3-deceased-id')} value={this.state.deceasedId || ''}
                  onChange={this.setValue.bind(this, 'deceasedId')} />
              </div>
            </Nav.Row> : null
            }
            {this.state.civilstatus === 'samboer' ? <Nav.Row>
              <div className='col-md-6 mb-4'>
                <h5>{t('pselv:form-step3-samboer-title')}</h5>
                <Nav.Checkbox label={t('pselv:form-step3-samboer-label')} value={this.state.samboer || ''}
                  onChange={this.setValue.bind(this, 'samboer')} />
              </div>
            </Nav.Row> : null
            }
          </React.Fragment> : null
          }

          { step === 4 ? <React.Fragment>
            <h4 className='mb-4'>{t('pselv:form-step4-title')}</h4>
            <div className='mb-4' dangerouslySetInnerHTML={{ __html: t('pselv:form-step4-description-1') }} />
            <div className='mb-4'>{t('pselv:form-step4-description-2')}</div>
            <div className='mb-4'><a href='#externalhref'>{t('pselv:form-step4-anchor-text-1')}</a></div>
            <hr />
            <div className='mb-4'>{t('pselv:form-step4-description-3')}</div>
            <div className='mb-4'><a href='#externalhref'>{t('pselv:form-step4-anchor-text-2')}</a></div>
            <div className='mb-4'>{t('pselv:form-step4-description-4')}</div>
            <div className='mb-4'>{t('pselv:form-step4-description-5')}</div>
          </React.Fragment> : null
          }
        </div>
        <Nav.Row className='mb-4 mt-4'>
          <div className='col-md-12'>
            {step !== 4
              ? <Nav.Hovedknapp className='forwardButton' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:forward')}</Nav.Hovedknapp>
              : <Nav.Hovedknapp className='sendButton' onClick={this.onSaveButtonClick.bind(this)}>{t('ui:confirmAndSave')}</Nav.Hovedknapp> }
            {step !== 0 ? <Nav.Knapp className='backButton ml-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
          </div>
        </Nav.Row>
      </TopContainer>
    }
}

PSelv.propTypes = {
  history: PT.object,
  t: PT.func,
  locale: PT.string,
  location: PT.object.isRequired,
  actions: PT.object,
  step: PT.number.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(PSelv)
)
