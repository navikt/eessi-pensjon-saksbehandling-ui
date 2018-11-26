import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import BannerIllustration from './BannerIllustration'
import * as Nav from '../Nav'

import './Banner.css'

class Banner extends Component {

   render () {

     const { t } = this.props

     return <div className='c-ui-banner'>
       <div className='container'>
         <div>
           <h1>{t('app-headerTitle')}</h1>
         </div>
         <BannerIllustration/>
       </div>
     </div>
   }
}

export default withNamespaces()(Banner)
