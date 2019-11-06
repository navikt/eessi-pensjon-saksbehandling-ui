import React, { useCallback } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'
import './BUCCrumbs.css'

const BUCCrumbs = ({ actions, bucs, currentBuc, className, mode, setMode, showLastLink = false, t }) => {
  const goToHome = useCallback(() => {
    actions.resetSed()
    actions.resetBuc()
    setMode('buclist')
  }, [actions, setMode])

  const goToEdit = useCallback(() => {
    actions.resetSed()
    setMode('bucedit')
  }, [actions, setMode])

  const goToNewBUC = useCallback(() => {
    setMode('bucnew')
  }, [setMode])

  const goToNewSED = useCallback(() => {
    setMode('sednew')
  }, [setMode])

  const buccrumbs = [{
    label: t('buc:buccrumb-home'),
    func: goToHome
  }]

  if (mode === 'bucnew') {
    buccrumbs.push({
      label: t('buc:buccrumb-newbuc'),
      func: goToNewBUC
    })
  }

  if (mode === 'bucedit' || mode === 'sednew') {
    buccrumbs.push({
      label: t(`buc:buc-${bucs[currentBuc].type}`),
      func: goToEdit
    })
  }

  if (mode === 'sednew') {
    buccrumbs.push({
      label: t('buc:buccrumb-newsed'),
      func: goToNewSED
    })
  }

  return (
    <div className={classNames('a-buc-c-buccrumbs', className)}>
      {buccrumbs.map((buccrumb, i) => {
        const first = i === 0
        const last = (i === buccrumbs.length - 1)
        const onBucCrumbClick = buccrumb.func
        return (
          <React.Fragment key={i}>
            {!first ? <Nav.Chevron className='separator ml-1 mr-1' type='høyre' /> : null}
            <div className='a-buc-c-buccrumb'>
              {last && !showLastLink
                ? t(buccrumb.label)
                : <Nav.Lenke href='#' title={buccrumb.label} onClick={onBucCrumbClick}>{buccrumb.label}</Nav.Lenke>}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

BUCCrumbs.propTypes = {
  actions: PT.object.isRequired,
  bucs: PT.object,
  currentBuc: PT.string,
  mode: PT.string.isRequired,
  sed: PT.object,
  showLastLink: PT.bool,
  t: PT.func.isRequired
}
export default BUCCrumbs
