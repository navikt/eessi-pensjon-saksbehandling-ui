import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import TopContainer from 'components/ui/TopContainer/TopContainer'
import FrontPageDrawer from 'components/drawer/FrontPage'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { Systemtittel } from 'components/ui/Nav'
import { getDisplayName } from 'utils/displayName'
import './index.css'

export const mapStateToProps = (state) => {
  return {
    currentBUC: state.buc.currentBUC,
    bucsInfo: state.buc.bucsInfo,
    buc: state.buc.buc,
    subjectAreaList: state.buc.subjectAreaList,
    bucList: state.buc.bucList,
    tagList: state.buc.tagList,
    rinaId: state.buc.rinaId,
    loading: state.loading,
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    bucParam: state.app.params.buc,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions, ...uiActions }, dispatch)
  }
}

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

const ConnectedBucPageIndexWithTranslation = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCPageIndex))
ConnectedBucPageIndexWithTranslation.displayName = `Connect(${getDisplayName(withTranslation()(BUCPageIndex))})`
export default ConnectedBucPageIndexWithTranslation
