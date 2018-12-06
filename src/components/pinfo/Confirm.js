import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'

import * as pinfoActions from '../../actions/pinfo'
import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'
import Veilederpanel from '../ui/Panel/VeilederPanel'
import CountrySelect from '../ui/CountrySelect/CountrySelect'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Confirm extends React.Component {
  render () {
    const { t, locale, actions } = this.props
    const { person, bank, work, attachments, pension, onSave } = this.props.pinfo

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
              value={person.phone || ''}
              onChange={e => actions.setPerson({ phone: e.target.value })}
              type='text'
            />
          </Nav.Column>
        </Nav.Row>


        <Nav.Row>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-name')}
              value={person.phone || ''}
              onChange={e => actions.setPerson({ phone: e.target.value })}
              type='text'
            />
          </Nav.Column>
        </Nav.Row>


        <Nav.Row>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-phoneNumber')}
              value={person.phone || ''}
              onChange={e => actions.setPerson({ phone: e.target.value })}
              type='tel'
            />
          </Nav.Column>
          <Nav.Column md='4' sm='6' xs='12'>
            <Nav.Input
              label={t('pinfo:person-email')}
              value={person.email || ''}
              onChange={e => actions.setPerson({ email: e.target.value })}
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
                //onChange={this.setBankName}
                //feil={error.bankName ? { feilmelding: t(error.bankName) } : null}
                />
              </Nav.Column>
              <Nav.Column md='6'>
                <label className='skjemaelement__label'>{t('pinfo:bank-country')}</label>
                <CountrySelect locale={locale}
                  value={bank.bankCountry || null}
                //onSelect={this.setBankCountry}
                //error={error.bankCountry}
                //errorMessage={error.bankCountry}
                />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column md='12'>
                <Nav.Textarea label={t('pinfo:bank-address')} value={bank.bankAddress || ''}
                  style={{ minHeight: '100px' }}
                //onChange={this.setBankAddress}
                //feil={error.bankAddress ? { feilmelding: t(error.bankAddress) } : null}
                />
              </Nav.Column>
            </Nav.Row>
            <Nav.Row>
              <Nav.Column md='6'>
                <Nav.Input label={t('pinfo:bank-bicSwift')} value={bank.bankBicSwift || ''}
                //onChange={this.setBankBicSwift}
                //feil={error.bankBicSwift ? { feilmelding: t(error.bankBicSwift) } : null}
                />
              </Nav.Column>
              <Nav.Column md='6'>
                <Nav.Input label={t('pinfo:bank-iban')}
                  value={bank.bankIban || ''}
                //onChange={this.setBankIban}
                //feil={error.bankIban ? { feilmelding: t(error.bankIban) } : null}
                />
              </Nav.Column>
            </Nav.Row>
        </div>
        <Nav.Row>
          <Nav.Column xs='12'>
            <h3 className='typo-undertittel mt-2 mb-2'>{t('pinfo:OppholdIUtland')}</h3>
          </Nav.Column>
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
