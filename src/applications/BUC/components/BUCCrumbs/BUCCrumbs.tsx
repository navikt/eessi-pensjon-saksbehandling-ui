import { resetBuc, resetSed } from 'actions/buc'
import { BUCMode } from 'applications/BUC/index'
import { Bucs } from 'declarations/buc'
import { BucsPropType } from 'declarations/buc.pt'
import { linkLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Lenke from 'nav-frontend-lenker'
import Chevron from 'nav-frontend-chevron'
import styled from 'styled-components'

export interface BUCCrumbsProps {
  bucs?: Bucs
  className?: string
  currentBuc: string | undefined
  mode: BUCMode
  setMode: (mode: BUCMode) => void
  showLastLink ?: boolean
}

export interface BUCCrumbLink {
  label: string
  func: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

export type BUCCrumbLinks = Array<BUCCrumbLink>

const BUCCrumbsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SeparatorChevron = styled(Chevron)`
 width: 16px !important;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
`

const BUCCrumbs: React.FC<BUCCrumbsProps> = ({
  bucs, currentBuc, className, mode, setMode, showLastLink = false
}: BUCCrumbsProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const goToHome = useCallback((e) => {
    dispatch(resetSed())
    dispatch(resetBuc())
    linkLogger(e, { mode: 'buclist' })
    setMode('buclist')
  }, [dispatch, setMode])

  const goToEdit = useCallback((e) => {
    dispatch(resetSed())
    linkLogger(e, { mode: 'bucedit' })
    setMode('bucedit')
  }, [dispatch, setMode])

  const goToNewBUC = useCallback((e) => {
    linkLogger(e, { mode: 'bucnew' })
    setMode('bucnew')
  }, [setMode])

  const goToNewSED = useCallback((e) => {
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
        label: t(`buc:buc-${bucs ? bucs[currentBuc].type : ''}`),
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
    <BUCCrumbsDiv className={className}>
      {buccrumbs.map((buccrumb, i) => {
        const first: boolean = i === 0
        const last: boolean = (i === buccrumbs.length - 1)
        const onBucCrumbClick = buccrumb.func
        return (
          <React.Fragment key={i}>
            {!first && <SeparatorChevron type='høyre' />}
            <div className='a-buc-c-buccrumb'>
              {last && !showLastLink
                ? t(buccrumb.label)
                : (
                  <Lenke
                    href='#'
                    data-amplitude='buc.crumbs'
                    title={buccrumb.label}
                    onClick={onBucCrumbClick}
                  >
                    {buccrumb.label}
                  </Lenke>
                )}
            </div>
          </React.Fragment>
        )
      })}
    </BUCCrumbsDiv>
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
