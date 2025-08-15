import { ExternalLinkIcon } from '@navikt/aksel-icons'
import {HStack, Link} from '@navikt/ds-react'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { RinaUrl } from 'src/declarations/app.d'
import { State } from 'src/declarations/reducers'
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
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCFooterSelector => ({
  rinaUrl: state.buc.rinaUrl
})

const BUCFooter: React.FC<BUCFooterProps> = ({
  className, ...props
}: BUCFooterProps): JSX.Element => {
  const { t } = useTranslation()
  const { rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)

  return (
    <BUCFooterDiv
      data-testid='a_buc_c_BUCFooter'
      className={className}
      {...props}
    >
      {rinaUrl
        ? (
          <Link
            data-testid='a_buc_c_BUCFooter--gotorina_link'
            href={rinaUrl}
            target='rinaWindow'
          >
            <HStack gap="4">
              {t('ui:goToRina')}
              <ExternalLinkIcon fontSize="1.5rem" />
            </HStack>
          </Link>
          )
        : (
          <WaitingPanel
            data-testid='a_buc_c_BUCFooter--waiting-panel'
            size='xsmall'
          />
          )}
    </BUCFooterDiv>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
