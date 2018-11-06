import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import * as Nav from '../../ui/Nav'
import { removeEmail, setEmail } from '../../../actions/pinfo'

const Email = (props) => {
  return (
    <div className='col-md-12'>
      <Nav.Row className='col-md-12'>
        <div className='col-md-6'>
          <Nav.Input
            type='email'
            required={!props.displayErrorToggle}
            bredde='fullbredde'
            label={props.t('pinfo:form-userEmail') + ' *'}
            value={props.address || ''}
            onChange={props.setEmail}
            onInvalid={() => { props.displayErrorOn() }}
            feil={props.error ? { feilmelding: props.errorMessage } : null}
          />
        </div>
        <div className='col-md-2'>
          <Nav.Lukknapp type='button' onClick={props.numberOfSiblings === 0 ? props.clearEmail : props.removeEmail}>
            {props.t('pinfo:form-userEmailRemove')}
          </Nav.Lukknapp>
        </div>
      </Nav.Row>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    locale: state.ui.locale,
    address: state.pinfo.form.contact.email[ownProps.uuid].adresse
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    removeEmail: () => { dispatch(removeEmail(ownProps.uuid)) },
    setEmail: (e) => { dispatch(setEmail(ownProps.uuid, { adresse: e.target.value })) },
    clearEmail: () => { dispatch(setEmail(ownProps.uuid, { adresse: null })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Email)

Email.propTypes = {
  address: PT.string,
  t: PT.func
}
