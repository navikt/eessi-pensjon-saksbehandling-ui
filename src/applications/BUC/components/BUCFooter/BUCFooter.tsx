import { ExternalLinkIcon } from '@navikt/aksel-icons'
import {HStack, Link} from '@navikt/ds-react'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { RinaUrl } from 'src/declarations/app.d'
import { State } from 'src/declarations/reducers'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styles from './BUCFooter.module.css'
import classNames from "classnames";
import {JSX} from "react";

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
    <div
      data-testid='a_buc_c_BUCFooter'
      className={classNames(className, styles.BUCFooterDiv)}
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
    </div>
  )
}

export default BUCFooter
