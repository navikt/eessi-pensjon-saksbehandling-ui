import ExternalLink from 'assets/icons/line-version-logout'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import Lenke from 'nav-frontend-lenker'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export interface BUCFooterProps {
  className ?: string
}

export interface BUCFooterSelector {
  rinaUrl: RinaUrl | undefined
}

const BUCFooterDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`
const NormalText = styled(Normaltekst)`
  margin-left: 0.5rem;
`
const mapState = (state: State): BUCFooterSelector => ({
  rinaUrl: state.buc.rinaUrl
})
const BUCFooter: React.FC<BUCFooterProps> = ({
  className
}: BUCFooterProps): JSX.Element => {
  const { t } = useTranslation()
  const { rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)
  if (!rinaUrl) {
    return <div />
  }
  return (
    <BUCFooterDiv className={className}>
      <Lenke
        data-amplitude='buc.list.rinaurl'
        id='a-buc-c-buclist__gotorina-link'
        className='a-buc-c-buclist__gotorina'
        href={rinaUrl}
        target='rinaWindow'
        onClick={linkLogger}
      >
        <div className='d-flex'>
          <ExternalLink color='#0067C5'/>
          <NormalText>
            {t('ui:goToRina')}
          </NormalText>
        </div>
      </Lenke>
    </BUCFooterDiv>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
