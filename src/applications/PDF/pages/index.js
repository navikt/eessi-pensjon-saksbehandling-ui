import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from 'components/ui/TopContainer/TopContainer'
import FrontPageDrawer from 'components/drawer/FrontPage'
import PDFWidget from 'applications/PDF/widgets'

export const PDFPageIndex = (props) => {
  const { t, className, history, location } = props

  return <TopContainer
    className={classNames('a-buc-page', className)}
    history={history}
    location={location}
    sideContent={<FrontPageDrawer t={t} />}
    header={t('pdf:app-createPdf')}>
    <div className='mt-4'>
      <PDFWidget />
    </div>
  </TopContainer>
}

PDFPageIndex.propTypes = {
  history: PT.object.isRequired,
  t: PT.func,
  className: PT.string,
  location: PT.object.isRequired
}

export default withTranslation()(PDFPageIndex)
