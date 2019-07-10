import React from 'react'
import PT from 'prop-types'

const BUCCrumbs = (props) => {

  const { resetBuc, resetSed, setMode, t, mode, buc } = props

  const goToRoot = () => {
    resetSed()
    resetBuc()
    setMode('buclist')
  }
  const goToEdit = () => {
    resetSed()
    setMode('bucedit')
  }
  const goToNewBUC = () => {
    setMode('bucnew')
  }
  const goToNewSED = () => {
    setMode('sednew')
  }

  return <div className={'d-flex flex-row'}>
    <div>
      <a href='#' onClick={goToRoot}>
        /{t('buc:breadcrumb-root')}
      </a>
    </div>
    { mode === 'bucnew'
      ? (
        <div>
          <a href='#' onClick={goToNewBUC}>/{t('buc:breadcrumb-newbuc')}</a>
        </div>)
      : null }
    { mode === 'bucedit' || mode === 'sednew'
      ? (
        <div>
          <a href='#' onClick={goToEdit}>/{t(`buc:buc-${buc.type}`)}</a>
        </div>)
      : null }
    { mode === 'sednew'
      ? (
        <div>
          <a href='#' onClick={goToNewSED}>/{t('buc:breadcrumb-newsed')}</a>
        </div>)
      : null }
  </div>
}

BUCCrumbs.propTypes = {
  resetSed: PT.func,
  resetBuc: PT.func,
  setMode: PT.func,
  t: PT.func,
  mode: PT.string,
  buc: PT.object,
  sed: PT.object
}
export default BUCCrumbs
