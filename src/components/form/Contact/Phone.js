import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import * as Nav from '../../ui/Nav'
import { removePhone, setPhone } from '../../../actions/pinfo'

const Phone = (props) => {
  return <div className='col-md-12'>
    <Nav.Row className='col-md-12'>
      <div className='col-md-6'>
        <Nav.Input
          onInvalid={() => { props.displayErrorOn() }}
          required={!props.displayErrorToggle}
          bredde='fullbredde'
          label={props.t('pinfo:form-userPhone') + ' *'}
          value={props.nummer || ''}
          onChange={props.setPhoneNumber}
          type='tel'
          feil={props.numberError ? { feilmelding: props.numberErrorMessage } : null}
        />
      </div>
      <div className='col-md-4'>

        <Nav.Select
          required={!props.displayErrorToggle}
          label={props.t('pinfo:form-userPhoneType')}
          value={props.type || ''}
          onChange={props.setPhoneType}
          feil={props.typeError ? { feilmelding: props.typeErrorMessage } : null}
        >
          <option value=''>{props.t('pinfo:form-userPhoneTypeNone')}</option>
          <option value={'home'}>{props.t('pinfo:form-userPhoneTypeHome')}</option>
          <option value={'mobile'}>{props.t('pinfo:form-userPhoneTypeMobile')}</option>
          <option value={'work'}>{props.t('pinfo:form-userPhoneTypeWork')}</option>
        </Nav.Select>
      </div>
      <div className='col-md-2'>
        <Nav.Lukknapp type='button' onClick={props.numberOfSiblings === 0 ? props.clearPhone : props.removePhone} >
          {props.t('pinfo:form-userPhoneRemove')}
        </Nav.Lukknapp>
      </div>
    </Nav.Row>
  </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    locale: state.ui.locale,
    nummer: state.pinfo.form.contact.phone[ownProps.uuid].nummer,
    type: state.pinfo.form.contact.phone[ownProps.uuid].type
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    removePhone: () => { dispatch(removePhone(ownProps.uuid)) },
    setPhoneNumber: (e) => { dispatch(setPhone(ownProps.uuid, { nummer: e.target.value })) },
    setPhoneType: (e) => { dispatch(setPhone(ownProps.uuid, { type: e.target.value })) },
    clearPhone: () => { dispatch(setPhone(ownProps.uuid, { type: null, nummer: null })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Phone)

Phone.propTypes = {
  nummer: PT.string,
  type: PT.string,
  t: PT.func
}
