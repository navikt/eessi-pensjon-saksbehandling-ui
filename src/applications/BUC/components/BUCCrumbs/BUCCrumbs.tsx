import { Bucs } from 'applications/BUC/declarations/buc.d'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useCallback } from 'react'
import { ActionCreators, T } from 'types.d'
import './BUCCrumbs.css'

export interface BUCCrumbsProps {
  actions: ActionCreators;
  bucs: Bucs;
  className?: string;
  currentBuc: string | undefined;
  mode: string;
  setMode: Function;
  showLastLink ?: boolean;
  t: T;
}

interface BUCCrumbLink {
  label: string;
  func: Function
}

const BUCCrumbs = ({
  actions, bucs, currentBuc, className, mode, setMode, showLastLink = false, t
}: BUCCrumbsProps) => {
  const goToHome: Function = useCallback(() => {
    actions.resetSed()
    actions.resetBuc()
    setMode('buclist')
  }, [actions, setMode])

  const goToEdit: Function = useCallback(() => {
    actions.resetSed()
    setMode('bucedit')
  }, [actions, setMode])

  const goToNewBUC: Function = useCallback(() => {
    setMode('bucnew')
  }, [setMode])

  const goToNewSED: Function = useCallback(() => {
    setMode('sednew')
  }, [setMode])

  const buccrumbs: Array<BUCCrumbLink> = [{
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
    if (currentBuc !== undefined) {
      buccrumbs.push({
        label: t(`buc:buc-${bucs[currentBuc].type}`),
        func: goToEdit
      })
    }
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
        const first: boolean = i === 0
        const last: boolean = (i === buccrumbs.length - 1)
        const onBucCrumbClick: Function = buccrumb.func
        return (
          <React.Fragment key={i}>
            {!first ? <Ui.Nav.Chevron className='separator ml-1 mr-1' type='høyre' /> : null}
            <div className='a-buc-c-buccrumb'>
              {last && !showLastLink
                ? t(buccrumb.label)
                : <Ui.Nav.Lenke href='#' title={buccrumb.label} onClick={onBucCrumbClick}>{buccrumb.label}</Ui.Nav.Lenke>}
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
  showLastLink: PT.bool,
  t: PT.func.isRequired
}

export default BUCCrumbs
