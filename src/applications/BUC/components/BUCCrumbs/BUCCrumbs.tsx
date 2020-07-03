import { resetBuc, resetSed } from 'actions/buc'
import { BUCMode } from 'applications/BUC/index'
import classNames from 'classnames'
import { Bucs } from 'declarations/buc'
import { BucsPropType } from 'declarations/buc.pt'
import Ui from 'eessi-pensjon-ui'
import { linkLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import './BUCCrumbs.css'

export interface BUCCrumbsProps {
  bucs: Bucs;
  className?: string;
  currentBuc: string | undefined;
  mode: BUCMode;
  setMode: (mode: BUCMode) => void;
  showLastLink ?: boolean;
}

export interface BUCCrumbLink {
  label: string;
  func: Function
}

type BUCCrumbLinks = Array<BUCCrumbLink>

const BUCCrumbs: React.FC<BUCCrumbsProps> = ({
  bucs, currentBuc, className, mode, setMode, showLastLink = false
}: BUCCrumbsProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const goToHome = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(resetSed())
    dispatch(resetBuc())
    linkLogger(e, { mode: 'buclist' })
    setMode('buclist')
  }, [dispatch, setMode])

  const goToEdit = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(resetSed())
    linkLogger(e, { mode: 'bucedit' })
    setMode('bucedit')
  }, [dispatch, setMode])

  const goToNewBUC = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    linkLogger(e, { mode: 'bucnew' })
    setMode('bucnew')
  }, [setMode])

  const goToNewSED = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    linkLogger(e, { mode: 'sednew' })
    setMode('sednew')
  }, [setMode])

  const buccrumbs: BUCCrumbLinks = [{
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
                : (
                  <Ui.Nav.Lenke
                    href='#'
                    data-amplitude='buc.crumbs'
                    title={buccrumb.label}
                    onClick={onBucCrumbClick}
                  >
                    {buccrumb.label}
                  </Ui.Nav.Lenke>
                )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

BUCCrumbs.propTypes = {
  bucs: BucsPropType.isRequired,
  className: PT.string,
  currentBuc: PT.string,
  mode: PT.oneOf<BUCMode>(['buclist', 'bucedit', 'bucnew', 'sednew']).isRequired,
  setMode: PT.func.isRequired,
  showLastLink: PT.bool
}

export default BUCCrumbs
