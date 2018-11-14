import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import * as pinfoActions from '../../actions/pinfo'

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
  this.props.actions.setPension({ [key]: value })
}

class Pension extends React.Component {
  constructor (props) {
    super(props)
    this.setRetirementCountry = valueSetProperty.bind(this, 'retirementCountry')
  }

  render () {
    const { t, locale, pension } = this.props
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
              />
            </div>
          </Nav.Row>
        </div>
      </fieldset>
    )
  }
}

Pension.propTypes = {
  pension: PT.object,
  setEventProperty: PT.func,
  t: PT.func,
  locale: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pension)
