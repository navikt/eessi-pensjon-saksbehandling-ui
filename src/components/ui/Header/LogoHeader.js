import React, { Component } from 'react'

import * as navLogo from '../../../resources/images/nav-logo-red.svg'
import '../app-decorator-v4.css'
import '../bundle.css'

class LogoHeader extends Component {
  render () {
    return <React.Fragment>
      <div className='sitelogo sitelogo-large'>
        <div>
          <a href='https://www.nav.no' title='Hjem'>
            <img src={navLogo} alt='NAV-logo' />
          </a>
        </div>
      </div>
      <div className='sitelogo sitelogo-small'>
        <a href='https://www.nav.no' title='Hjem'>
          <img src={navLogo} alt='NAV-logo' />
        </a>
      </div>
    </React.Fragment>
  }
}

export default LogoHeader
