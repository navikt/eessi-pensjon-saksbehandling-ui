import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../ui/Nav'
import Veilederpanel from '../ui/Panel/VeilederPanel'

import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.person.phone,
    email: state.pinfo.person.email,
    previousName: state.pinfo.person.previousName,
    nameAtBirth: state.pinfo.person.nameAtBirth
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
      <Nav.Row>
        <Nav.Column xs='12'>
          <Veilederpanel className= 'mb-4'>
            <p>Bork bork bork bork!</p>
          </Veilederpanel>
        </Nav.Column>
      </Nav.Row>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:person-title')}</h2>
      <Nav.Row className='mt-3' style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-9'>
          <Nav.Input
            label={t('pinfo:person-lastNameAfterBirth')}
            value={nameAtBirth || ''}
            onChange={e=>actions.setPerson({nameAtBirth: e.target.value})}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-9'>
          <Nav.Input
            label={t('pinfo:person-name')}
            value={previousName || ''}
            onChange={e=>actions.setPerson({previousName: e.target.value})}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-4'>
          <Nav.Input
            label={t('pinfo:person-phoneNumber')}
            value={phone || ''}
            onChange={e=>actions.setPerson({phone: e.target.value})}
            type='tel'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-6'>
          <Nav.Input
            label={t('pinfo:person-email')}
            value={email || ''}
            onChange={e=>actions.setPerson({email: e.target.value})}
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
