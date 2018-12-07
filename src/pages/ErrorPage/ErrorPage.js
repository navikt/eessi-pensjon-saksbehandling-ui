import React, { Component } from 'react'
import PT from 'prop-types'


import LogoHeader from '../../components/ui/Header/LogoHeader'
import FirstBanner from '../../components/ui/Banner/FirstBanner'
import * as Nav from '../../components/ui/Nav'


class ErrorPage extends Component {

  render () {

    return <div className='p-firstPage hodefot'>
      <LogoHeader />
      <FirstBanner i18Key='' veilI18Key=''/>
      <div className='content'>
        <h2>Feilside</h2>
      </div>
    </div>
  }
}


export default ErrorPage

