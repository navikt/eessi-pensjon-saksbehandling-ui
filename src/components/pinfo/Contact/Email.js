import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Nav from '../../ui/Nav'
import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state, ownProps) => {
  return {
    locale: state.ui.locale,
    email: state.pinfo.form.contact.email[ownProps.uuid],
    address: state.pinfo.form.contact.email[ownProps.uuid].address
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions }, dispatch) }
}
function removeEmail () {
  this.props.actions.removeEmail(this.props.uuid)
}
function setEmail (event) {
  this.props.actions.setEmail(this.props.uuid, { address: event.target.value })
}

class Email extends React.Component {
  constructor (props) {
    super(props)
    this.removeEmail = removeEmail.bind(this)
    this.setEmail = setEmail.bind(this)
  }

  render () {
    const props = this.props
    const addressError = props.testEmail(props.email, props.t)
    return (
      <Nav.Row className='col-md-12'>
        <div className='col-md-11 col-xs-10'>
          <Nav.Input
            type='email'
            required={props.required || false}
            bredde='fullbredde'
            label={props.t('pinfo:form-userEmail') + ' *'}
            value={props.address || ''}
            onChange={this.setEmail}
            onInvalid={props.displayErrorSwitch.on}
            feil={props.displayError && addressError ? { feilmelding: addressError } : null}
          />
        </div>
        <div className='col-md-1 col-xs-2'>
          {props.numberOfSiblings > 0
            ? <Nav.Lukknapp className='Contact-button' type='button' onClick={this.removeEmail}>
              {props.t('pinfo:form-userEmailRemove')}
            </Nav.Lukknapp>
            : null
          }
        </div>
      </Nav.Row>
    )
  }
}

Email.propTypes = {
  address: PT.string,
  t: PT.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Email)
