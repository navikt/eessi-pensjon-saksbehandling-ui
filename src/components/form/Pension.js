import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import { setEventProperty } from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pension: _.pick(state.pinfo.form, ['retirementCountry'])
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setEventProperty: (key, payload) => { dispatch(setEventProperty({ [key]: payload })) }
  }
}

class Pension extends React.Component {
  constructor (props) {
    super(props)
    this.setRetirementCountry = this.props.setEventProperty.bind(null, 'retirementCountry')
  }

  render () {
    const { t, locale, pension } = this.props
    return (
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
