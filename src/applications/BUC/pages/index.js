import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from 'components/ui/TopContainer/TopContainer'
import FrontPageDrawer from 'components/drawer/FrontPage'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { Systemtittel } from 'components/ui/Nav'
import './index.css'

export const BUCPageIndex = (props) => {
  const { t, className, history, location } = props

  return <TopContainer
    className={classNames('a-buc-page', className)}
    history={history}
    location={location}
    sideContent={<FrontPageDrawer t={t} />}
    header={t('buc:app-bucTitle') + ' - ' + t('buc:step-startBUCTitle')}>
    <div className='mt-4'>
      <Systemtittel className='mb-4'>{t('buc:step-startBUCTitle')}</Systemtittel>
      <BUCStart mode='page' {...props} /> : null}
    </div>
  </TopContainer>
}

BUCPageIndex.propTypes = {
  history: PT.object.isRequired,
  t: PT.func,
  className: PT.string,
  location: PT.object.isRequired
}

const BucPageIndexWithTranslation = withTranslation()(BUCPageIndex)

export default BucPageIndexWithTranslation
