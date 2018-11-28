import React, { Component } from 'react'

import '../app-decorator-v4.css'
import '../bundle.css'

class LogoHeader extends Component {

   render () {

    return <React.Fragment>
        <div className='sitelogo sitelogo-large'>
          <div>
            <a href='https://www.nav.no' title='Hjem' data-ga='Header/Logo'>
              <img src='https://appres.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo'/>
            </a>
          </div>
        </div>
        <div className='sitelogo sitelogo-small'>
          <a href='https://www.nav.no' title='Hjem'>
            <img src='https://appres.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo'/>
          </a>
        </div>
      </React.Fragment>
  }
}

export default LogoHeader
