import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { connect, bindActionCreators } from 'store'
import { NavFrontendSpinner } from 'components/ui/Nav'
import * as bucActions from 'actions/buc'
import * as appActions from 'actions/app'

import BUCList from './BUCList'
import BUCNew from './BUCNew'
import SEDNew from './SEDNew'
import BUCEdit from './BUCEdit'

import './index.css'

const mapStateToProps = (state) => {
  return {
    mode: state.buc.mode,
    bucs: state.buc.bucs,
    buc: state.buc.buc,
    bucsInfo: state.buc.bucsInfo,
    bucsInfoList: state.buc.bucsInfoList,
    rinaUrl: state.buc.rinaUrl,
    seds: state.buc.seds,
    gettingBUCs: state.loading.gettingBUCs,
    locale: state.ui.locale,
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...bucActions, ...appActions }, dispatch)
  }
}

export const BUCWidgetIndex = (props) => {
  const { actions, aktoerId, bucs, gettingBUCs, mode, rinaUrl, sakId, t } = props
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && !rinaUrl) {
      actions.getRinaUrl()
      setMounted(true)
    }
  }, [mounted, rinaUrl, actions])

  useEffect(() => {
    if (bucs === undefined && aktoerId && sakId && !gettingBUCs) {
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfoList(aktoerId)
    }
  }, [bucs, aktoerId, sakId, gettingBUCs])

  if (!mounted) {
    return null
  }

  if (gettingBUCs) {
    return <div className='mt-5 a-buc-widget__loading'>
     <NavFrontendSpinner className='ml-3 mr-3' type='XL' />
     <span className='pl-2'>{t('buc:loading-bucs')}</span>
    </div>
  }

  if (bucs === null) {
    return <div className='mt-5 a-buc-widget__loading'>
      {t('buc:error-noBucs')}
    </div>
  }

  return <div className='a-buc-widget'>
    {mode === 'newbuc' ? <BUCNew {...props} /> : null}
    {mode === 'newsed' ? <SEDNew {...props} /> : null}
    {mode === 'list' ? <BUCList {...props} /> : null}
    {mode === 'edit' ? <BUCEdit {...props} /> : null}
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCWidgetIndex))
