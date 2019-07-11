import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Chevron, Lenke } from 'components/ui/Nav'
import './BUCCrumbs.css'

const BUCCrumbs = (props) => {
  const { actions, buc, className, mode, t } = props

  const goToHome = () => {
    actions.resetSed()
    actions.resetBuc()
    actions.setMode('buclist')
  }

  const goToEdit = () => {
    actions.resetSed()
    actions.setMode('bucedit')
  }

  const goToNewBUC = () => {
    actions.setMode('bucnew')
  }

  const goToNewSED = () => {
    actions.setMode('sednew')
  }

  let buccrumbs = [{
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
      label: t(`buc:buc-${buc.type}`),
      func: goToEdit
    })
  }

  if (mode === 'sednew') {
    buccrumbs.push({
      label: t('buc:buccrumb-newsed', {
        buc: buc.type,
        sed: t('buc:form-newSed')
      }),
      func: goToNewSED
    })
  }

  return <div className={classNames('a-buc-c-buccrumbs', className)}>
    {buccrumbs.map((buccrumb, i) => {
      const first = i === 0
      const last = (i === buccrumbs.length - 1)
      return <React.Fragment>
        {!first ? <Chevron className='separator' type={'høyre'} /> : null}
        <div className='a-buc-c-buccrumb'>
          {last ? t(buccrumb.label) : <Lenke href='#' onClick={buccrumb.func}>{buccrumb.label}</Lenke>}
        </div>
      </React.Fragment>
    })}
  </div>
}

BUCCrumbs.propTypes = {
  actions: PT.object.isRequired,
  setMode: PT.func,
  t: PT.func,
  mode: PT.string,
  buc: PT.object,
  sed: PT.object
}
export default BUCCrumbs
