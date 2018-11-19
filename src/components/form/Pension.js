import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import * as pinfoActions from '../../actions/pinfo'
import { pensionValidation } from '../pinfo/tests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pension: state.pinfo.form.pension
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions }, dispatch) }
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
    const { t, locale, pension } = this.props
    const error = {
      retirementCountry: pensionValidation.retirementCountry(pension, t)
    }
    return (
      <fieldset>
        <legend>{t('pinfo:form-retirement')}</legend>
        <div className='col-xs-12'>
          <Nav.Row>
            <div className='col-md-6'>
              <label>{t('pinfo:form-retirementCountry') + ' *'}</label>
              <CountrySelect
                locale={locale}
                value={pension.retirementCountry || null}
                onSelect={this.setRetirementCountry}
                error={this.state.displayError && !!error.retirementCountry}
                errorMessage={error.retirementCountry}
              />
            </div>
          </Nav.Row>
        </div>
      </fieldset>
    )
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
