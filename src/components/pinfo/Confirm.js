import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as pinfoActions from '../../actions/pinfo'
import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'
import Veilederpanel from '../ui/Panel/VeilederPanel'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import { personValidation, bankValidation, stayAbroadValidation } from './Validation/singleTests'
import Period from './StayAbroad/Period'

const validation = { ...personValidation, ...bankValidation, ...stayAbroadValidation }

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file,
    stayAbroad: state.pinfo.stayAbroad
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Confirm extends React.Component {
  state = {
    error: {},
    editPeriod: undefined
  }

  constructor (props) {
    super(props)
    this.setNameAtBirth = this.eventSetProperty.bind(this, 'nameAtBirth', validation.nameAtBirth, this.props.actions.setPerson)
    this.setPreviousName = this.eventSetProperty.bind(this, 'previousName', validation.previousName, this.props.actions.setPerson)
    this.setPhone = this.eventSetProperty.bind(this, 'phone', validation.phone, this.props.actions.setPerson)
    this.setEmail = this.eventSetProperty.bind(this, 'email', validation.email, this.props.actions.setPerson)
    this.setBankName = this.eventSetProperty.bind(this, 'bankName', validation.bankName, this.props.actions.setBank)
    this.setBankAddress = this.eventSetProperty.bind(this, 'bankAddress', validation.bankAddress, this.props.actions.setBank)
    this.setBankCountry = this.valueSetProperty.bind(this, 'bankCountry', validation.bankCountry, this.props.actions.setBank)
    this.setBankBicSwift = this.eventSetProperty.bind(this, 'bankBicSwift', validation.bankBicSwift, this.props.actions.setBank)
    this.setBankIban = this.eventSetProperty.bind(this, 'bankIban', validation.bankIban, this.props.actions.setBank)
  }

  eventSetProperty (key, validateFunction, action, event) {
    this.valueSetProperty(key, validateFunction, action, event.target.value)
  }

  valueSetProperty (key, validateFunction, action, value) {
    const { actions } = this.props
    action({ [key]: value })
    this.setState({
      error: {
        ...this.state.error,
        [key]: validateFunction(value)
      }
    })
  }

  setEditPeriod (period) {
    this.setState({
      editPeriod: period
    })
  }

  render () {
    const { error, editPeriod } = this.state
    const { pageError, t, locale, actions } = this.props
    const { stayAbroad, person, bank, work, attachments, pension, onSave } = this.props.pinfo

    return (
      <div>
        <Nav.Row>
          <Nav.Column xs='12'>
            <Veilederpanel className='mb-4'>
              <p>Bork bork bork bork!</p>
            </Veilederpanel>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs='12'>
            <h2 className='typo-Innholdstittel ml-0 mb-4 appDescription'>{t('pinfo:Undertittel')}</h2>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs='12'>
            <h3 className='typo-undertittel mb-4'>{t('pinfo:person-title')}</h3>
          </Nav.Column>
        </Nav.Row>

        <Nav.Row>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-lastNameAfterBirth')}
              value={person.nameAtBirth || ''}
              onChange={this.setNameAtBirth}
              type='text'
            />
          </Nav.Column>
        </Nav.Row>

        <Nav.Row>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-name')}
              value={person.previousName || ''}
              onChange={this.setPreviousName}
              type='text'
            />
          </Nav.Column>
        </Nav.Row>

        <Nav.Row>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-phoneNumber')}
              value={person.phone || ''}
              onChange={this.setPhone}
              type='tel'
            />
          </Nav.Column>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-email')}
              value={person.email || ''}
              onChange={this.setEmail}
              type='email'
            />
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column xs='12'>
            <h3 className='typo-undertittel mt-2 mb-2'>{t('pinfo:BankInformasjon')}</h3>
          </Nav.Column>
        </Nav.Row>
        <div>
          <Nav.Row>
            <Nav.Column md='6'>
              <Nav.Input label={t('pinfo:bank-name')} value={bank.bankName || ''}
                onChange={this.setBankName}
                feil={error.bankName && pageError ? { feilmelding: t(error.bankName) } : null}
              />
            </Nav.Column>
            <Nav.Column md='6'>
              <label className='skjemaelement__label'>{t('pinfo:bank-country')}</label>
              <CountrySelect locale={locale}
                value={bank.bankCountry || null}
                onSelect={this.setBankCountry}
                error={error.bankCountry && pageError}
                errorMessage={error.bankCountry}
              />
            </Nav.Column>
          </Nav.Row>
          <Nav.Row>
            <Nav.Column md='12'>
              <Nav.Textarea label={t('pinfo:bank-address')} value={bank.bankAddress || ''}
                style={{ minHeight: '100px' }}
                onChange={this.setBankAddress}
                feil={error.bankAddress && pageError ? { feilmelding: t(error.bankAddress) } : null}
              />
            </Nav.Column>
          </Nav.Row>
          <Nav.Row>
            <Nav.Column md='6'>
              <Nav.Input label={t('pinfo:bank-bicSwift')} value={bank.bankBicSwift || ''}
                onChange={this.setBankBicSwift}
                feil={error.bankBicSwift && pageError ? { feilmelding: t(error.bankBicSwift) } : null}
              />
            </Nav.Column>
            <Nav.Column md='6'>
              <Nav.Input label={t('pinfo:bank-iban')}
                value={bank.bankIban || ''}
                onChange={this.setBankIban}
                feil={error.bankIban && pageError ? { feilmelding: t(error.bankIban) } : null}
              />
            </Nav.Column>
          </Nav.Row>
        </div>
        <Nav.Row>
          <h3 className='typo-undertittel mt-2 mb-2'>{t('pinfo:stayAbroad-previousPeriods')}</h3>
          {stayAbroad.map((period, index) => {
            return <Period t={t}
              mode='view'
              current={editPeriod && editPeriod.id === period.id}
              period={period}
              locale={locale}
              periods={stayAbroad}
              setStayAbroad={actions.setStayAbroad}
              editPeriod={this.setEditPeriod.bind(this)}
              key={period.id} />
          })}
        </Nav.Row>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Confirm)
)
