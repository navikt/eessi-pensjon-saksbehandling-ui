import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Nav from '../../ui/Nav'
import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state, ownProps) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.form.contact.phone[ownProps.uuid]
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions }, dispatch) }
}
function removePhone () {
  this.props.actions.removePhone(this.props.uuid)
}
function setPhoneNumber (event) {
  this.props.actions.setPhone(this.props.uuid, { number: event.target.value })
}
function setPhoneType (event) {
  this.props.actions.setPhone(this.props.uuid, { type: event.target.value })
}

class Phone extends React.Component {
  constructor (props) {
    super(props)
    this.removePhone = removePhone.bind(this)
    this.setPhoneNumber = setPhoneNumber.bind(this)
    this.setPhoneType = setPhoneType.bind(this)
  }
  render () {
    const props = this.props
    const numberError = props.testPhoneNumber(props.phone, props.t)
    const typeError = props.testPhoneType(props.phone, props.t)
    return (
      <Nav.Row className='col-md-12'>
        <div className='col-md-7 col-xs-5'>
          <Nav.Input
            onInvalid={props.displayErrorSwitch.on}
            required={props.required || false}
            bredde='fullbredde'
            label={props.t('pinfo:form-userPhone') + ' *'}
            value={props.phone.number || ''}
            onChange={this.setPhoneNumber}
            type='tel'
            feil={props.displayError && numberError ? { feilmelding: numberError } : null}
          />
        </div>
        <div className='col-md-4 col-xs-5' >
          <Nav.Select
            required={props.required || false}
            label={props.t('pinfo:form-userPhoneType')}
            value={props.phone.type || ''}
            onChange={this.setPhoneType}
            feil={props.displayError && typeError ? { feilmelding: typeError } : null}
          >
            <option value=''>{props.t('pinfo:form-userPhoneTypeNone')}</option>
            <option value={'home'}>{props.t('pinfo:form-userPhoneTypeHome')}</option>
            <option value={'mobile'}>{props.t('pinfo:form-userPhoneTypeMobile')}</option>
            <option value={'work'}>{props.t('pinfo:form-userPhoneTypeWork')}</option>
          </Nav.Select>
        </div>
        <div className='col-md-1 col-xs-2'>
          {props.numberOfSiblings > 0
            ? <div className='row'>
              <Nav.Lukknapp type='button' className='Contact-button' onClick={this.removePhone}>
                {props.t('pinfo:form-userPhoneRemove')}
              </Nav.Lukknapp>
            </div>
            : null
          }
        </div>
      </Nav.Row>
    )
  }
}

Phone.propTypes = {
  phone: PT.object,
  type: PT.string,
  t: PT.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Phone)
