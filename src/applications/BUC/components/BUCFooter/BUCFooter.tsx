import { ExternalLink } from '@navikt/ds-icons'
import { Link } from '@navikt/ds-react'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { RinaUrl } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { linkLogger } from 'metrics/loggers'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export const BUCFooterDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

export interface BUCFooterProps {
  className ?: string
}

export interface BUCFooterSelector {
  highContrast: boolean
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCFooterSelector => ({
  highContrast: state.ui.highContrast,
  rinaUrl: state.buc.rinaUrl
})

const BUCFooter: React.FC<BUCFooterProps> = ({
  className
}: BUCFooterProps): JSX.Element => {
  const { t } = useTranslation()
  const { rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)

  return (
    <BUCFooterDiv className={className}>
      {rinaUrl
        ? (
          <Link
            data-amplitude='buc.list.rinaurl'
            data-test-id='a-buc-c-bucfooter__gotorina-link'
            href={rinaUrl}
            onClick={linkLogger}
            target='rinaWindow'
          >
            {t('ui:goToRina')}
            <HorizontalSeparatorDiv size='0.5' />
            <ExternalLink />
          </Link>
          )
        : (
          <WaitingPanel size='xsmall' />
          )}
    </BUCFooterDiv>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
