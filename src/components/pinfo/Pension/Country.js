import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'
import CountrySelect from '../../ui/CountrySelect/CountrySelect'

class Country extends React.Component {
  state = {
    country: undefined
  }

  onCountryChange (event) {
    let country = event.target.value

    this.setState({
      country: country
    })
  }

  addCountry () {
    const { t, countries, actions } = this.props
    const { country } = this.state

    if (countries.indexOf(country) < 0) {
      let newCountries = _.clone(countries)
      newCountries.push(country)
      actions.setCountries(newCountries)
      this.setState({
        country: undefined
      })
    }
  }

  removeCountry (country) {
    const { countries, actions } = this.props

    let index = countries.indexOf(country)

    if (index >= 0) {
      let newCountries = _.clone(countries)
      newCountries.splice(index, 1)
      actions.setCountries(newCountries)
    }
  }

  render () {
    const { value, t, locale, required, pension } = this.props
    const { country } = this.state

    return value ? <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removeCountry.bind(this, value)} mini>
          <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
          {t('ui:remove')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
      : <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-md-4'>
          <CountrySelect
            locale={locale}
            value={country || null}
            onSelect={this.onCountryChange.bind(this)}
            // error={this.state.displayError && !!error.retirementCountry}
            // errorMessage={error.retirementCountry}
          />

        </div>
        <div className='col-md-4'>
          <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addCountry.bind(this)} mini>
            <span className='mr-2' style={{ fontSize: '1.5rem' }}>+</span>
            {t('ui:add')}
          </Nav.Knapp>
        </div>
      </Nav.Row>
  }
}

Country.propTypes = {
  phone: PT.object,
  type: PT.string,
  t: PT.func
}

export default Country
