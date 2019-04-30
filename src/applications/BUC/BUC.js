import React from 'react'
import { withTranslation } from 'react-i18next'

import BUCList from '../BUC/BUCList'
import { Store } from './store'

const BUC = (props) => {
  const { t } = props

  return <div className='a-buc'>
    <Store>
      <BUCList t={t} />
    </Store>
  </div>
}

export default withTranslation()(BUC)
