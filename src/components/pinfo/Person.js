import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../ui/Nav'

import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.contact.phone,
    email: state.pinfo.contact.email,
    previousName: state.pinfo.contact.previousName,
    nameAtBirth: state.pinfo.contact.nameAtBirth
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Person extends React.Component {
  state = {
    error: undefined
  }

  render () {
    const { t, phone, email, previousName, nameAtBirth, actions } = this.props

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:contact-title')}</h2>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-xs-6'>
          <Nav.Input
            label={t('pinfo:contact-lastNameAtbirth')}
            value={nameAtBirth || ''}
            onChange={e=>actions.setContact({nameAtBirth: e.target.value})}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-xs-6'>
          <Nav.Input
            label={t('pinfo:contact-previousName')}
            value={previousName || ''}
            onChange={e=>actions.setContact({previousName: e.target.value})}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-md-2'>
          <Nav.Input
            label={t('pinfo:contact-phoneNumber')}
            value={phone || ''}
            onChange={e=>actions.setContact({phone: e.target.value})}
            type='tel'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-md-4'>
          <Nav.Input
            label={t('pinfo:contact-email')}
            value={email || ''}
            onChange={e=>actions.setContact({email: e.target.value})}
            type='email'
          />
        </div>
      </Nav.Row>
    </div>
  }
}

Person.propTypes = {
  locale: PT.string,
  phone: PT.string,
  email: PT.string,
  previousName: PT.string,
  nameAtBirth: PT.string,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Person)
)
