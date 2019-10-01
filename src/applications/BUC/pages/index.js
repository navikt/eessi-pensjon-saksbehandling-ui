import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import TopContainer from 'components/TopContainer/TopContainer'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { Nav } from 'eessi-pensjon-ui'
import * as bucActions from 'actions/buc'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import './index.css'

export const mapStateToProps = (state) => {
  return {
    bucsInfo: state.buc.bucsInfo,
    buc: state.buc.buc,
    currentBuc: state.buc.currentBuc,
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
  const { className, history, t } = props

  return (
    <TopContainer
      className={classNames('a-buc-page', className)}
      t={t}
      history={history}
      header={t('buc:app-bucTitle') + ' - ' + t('buc:step-startBUCTitle')}
    >
      <div className='mt-4'>
        <Nav.Systemtittel className='a-buc-page__title mb-4'>{t('buc:step-startBUCTitle')}</Nav.Systemtittel>
        <BUCStart mode='page' {...props} /> : null}
      </div>
    </TopContainer>
  )
}

BUCPageIndex.propTypes = {
  className: PT.string,
  history: PT.object.isRequired,
  t: PT.func.isRequired
}

const ConnectedBucPageIndexWithTranslation = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCPageIndex))
ConnectedBucPageIndexWithTranslation.displayName = 'Connect(BUCPageIndex)'
export default ConnectedBucPageIndexWithTranslation
