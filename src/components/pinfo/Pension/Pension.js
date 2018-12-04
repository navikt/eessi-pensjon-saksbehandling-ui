import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import Country from './Country'

import * as pinfoActions from '../../../actions/pinfo'
import { pensionValidation } from '../Validation/singleTests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pension: state.pinfo.pension
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

function valueSetProperty (key, value) {
  let payload = Array.isArray(value) ? {} : value
  this.props.actions.setPension({ [key]: payload })
}

function displayErrorOff () {
  this.setState({
    displayError: false
  })
}
function displayErrorOn () {
  this.setState({
    displayError: true
  })
}

class Pension extends React.Component {
  constructor (props) {
    super(props)
    this.setRetirementCountry = valueSetProperty.bind(this, 'retirementCountry')
    this.state = {
      displayError: true
    }
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }
  }

  render () {
    const { t, locale, pension, actions } = this.props
    const error = {
      retirementCountry: pensionValidation.retirementCountry(pension, t)
    }
    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:pension-title')}</h2>
      <div className='mt-3'>
        {pension.map(country => {
          return <Country t={t} countries={pension} locale={locale}
            actions={actions}
            key={country} value={country} />
        })}
        <Country t={t} countries={pension} locale={locale}
          required={false}
          actions={actions}
          displayErrorSwitch={this.displayErrorSwitch}
          displayError={this.state.displayError}

        />
      </div>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Pension)
)

Pension.propTypes = {
  pension: PT.object,
  setEventProperty: PT.func,
  t: PT.func,
  locale: PT.string
}
