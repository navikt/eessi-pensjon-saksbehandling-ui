import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { connect } from 'store'
import { NavFrontendSpinner, Undertekst, Undertittel } from 'components/Nav'
import Period from './Period'

export const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    p4000: state.buc.p4000,
    locale: state.ui.locale,
    loadingP4000list: state.loading.loadingP4000list,
    loadingP4000info: state.loading.loadingP4000info,
    p4000list: state.buc.p4000list,
    p4000info: state.buc.p4000info
  }
}

export const SEDP4000 = (props) => {
  const [ period, setPeriod ] = useState({})
  const [ maxPeriods ] = useState(8)
  const [ isReady, setIsReady ] = useState(false)

  const { actions, aktoerId, loadingP4000info, loadingP4000list, locale } = props
  const { p4000info, p4000list, setShowButtons, showButtons, t } = props
  const mode = period && period.id ? 'edit' : 'new'

  // check aktoerId
  useEffect(() => {
    if (!aktoerId) {
      setIsReady(true)
    }
  }, [aktoerId])

  // load P4000 file list
  useEffect(() => {
    if (!isReady && !loadingP4000list && p4000list === undefined) {
      actions.listP4000(aktoerId)
    }
  }, [aktoerId, actions, isReady, loadingP4000list, p4000list])

  // load P4000 info file if exists
  useEffect(() => {
    if (!isReady && !loadingP4000info && p4000info === undefined && _.isArray(p4000list)) {
      const p4000file = aktoerId + '___PINFO___PINFO.json'
      if (p4000list.indexOf(p4000file) >= 0) {
        actions.getP4000(p4000file)
      } else {
        setIsReady(true)
      }
    }
  }, [actions, aktoerId, loadingP4000info, p4000info, p4000list, isReady])

  // mark component as ready if p4000 info file is ready
  useEffect(() => {
    if (!isReady && p4000info !== undefined) {
      setIsReady(true)
    }
  }, [isReady, p4000info])

  useEffect(() => {
    // we are editing a period or adding a new period => hide main buttons
    if ((period.type || period.id) && showButtons) {
      setShowButtons(false)
    }
    // we are NOT editing a period or adding a new period => show main buttons
    if (!period.type && !period.id && !showButtons) {
      setShowButtons(true)
    }
  }, [mode, setShowButtons, showButtons, period])

  const setPeriods = (periods) => {
    actions.setP4000Info({
      ...p4000info,
      stayAbroad: periods
    })
  }

  if (!aktoerId) {
    return <div>{t('buc:validation-noAktoerId')}</div>
  }

  if (!isReady) {
    return <div className='col-md-8 d-flex mt-5 mb-5 align-items-center justify-content-center'>
      <NavFrontendSpinner className='ml-3 mr-3' type='M' />
      { loadingP4000list ? <span className='pl-2'>{t('buc:loading-p4000list')}</span> : null }
      { loadingP4000info ? <span className='pl-2'>{t('buc:loading-p4000info')}</span> : null }
    </div>
  }

  return <div className={classNames('a-buc-c-sedp4000', mode)}>
    {mode === 'new' ? <React.Fragment>
      <Undertittel className='mb-3'>{t('buc:p4000-title')}</Undertittel>
      <Undertekst className='mb-2'>{t('buc:p4000-description')}</Undertekst>
      <Undertekst className='mb-3'>{t('buc:p4000-info-on-help-icon')}</Undertekst>
    </React.Fragment> : null}
    {!_.isEmpty(p4000info.stayAbroad) && mode === 'new' ? <React.Fragment>
      <Undertittel className='mt-5 mb-2'>{t('buc:p4000-previousPeriods')}</Undertittel>
      {p4000info.stayAbroad.sort((a, b) => {
        return a.startDate - b.startDate
      }).map((period, index) => {
        return <Period t={t}
          locale={locale}
          actions={actions}
          mode='view'
          first={index === 0}
          last={index === p4000info.stayAbroad.length - 1}
          period={period}
          periods={p4000info.stayAbroad}
          setPeriod={setPeriod}
          setPeriods={setPeriods}
          key={index} />
      })}
    </React.Fragment>
      : null}
    { p4000info.stayAbroad.length < maxPeriods ?
    <Period t={t}
      actions={actions}
      mode={mode}
      showButtons={showButtons}
      period={period}
      periods={p4000info.stayAbroad}
      locale={locale}
      setPeriod={setPeriod}
      setPeriods={setPeriods}
    /> :
    <span>
      {t('buc:p4000-alert-maxPeriods', { maxPeriods: maxPeriods })}
    </span> }
  </div>
}

SEDP4000.propTypes = {
  actions: PT.object,
  aktoerId: PT.string.isRequired,
  loadingP4000info: PT.bool,
  loadingP4000list: PT.bool,
  locale: PT.string.isRequired,
  p4000info: PT.object,
  p4000list: PT.array,
  setShowButtons: PT.func.isRequired,
  showButtons: PT.bool.isRequired,
  t: PT.func
}

export default connect(mapStateToProps, () => {})(SEDP4000)
