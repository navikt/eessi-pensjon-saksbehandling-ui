import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from 'components/ui/Icons'

import './RefreshButton.css'

const RefreshButton = (props) => {
  const { t, onRefreshClick, rotating } = props

  return <div title={t('ui:refresh')} className={classNames('c-ui-refreshbutton')}>
    <a href='#refresh' onClick={onRefreshClick}>
      <div className={classNames({ rotating: rotating })}>
        <Icons kind='refresh' />
      </div>
    </a>
  </div>
}

RefreshButton.propTypes = {
  t: PT.func.isRequired,
  onRefreshClick: PT.func.isRequired,
  rotating: PT.bool.isRequired
}

export default RefreshButton
