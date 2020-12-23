import ExternalLink from 'assets/icons/line-version-logout'
import NavHighContrast, { HighContrastLink, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/app.d'
import { linkLogger } from 'metrics/loggers'
import { theme, themeKeys, themeHighContrast, Theme } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
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
  const { highContrast, rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)
  const _theme: Theme = highContrast ? themeHighContrast : theme
  const linkColor: string = _theme[themeKeys.MAIN_INTERACTIVE_COLOR]

  return (
    <NavHighContrast highContrast={highContrast}>
      <BUCFooterDiv className={className}>
        {rinaUrl
          ? (
            <HighContrastLink
              data-amplitude='buc.list.rinaurl'
              data-test-id='a-buc-c-bucfooter__gotorina-link'
              href={rinaUrl}
              onClick={linkLogger}
              target='rinaWindow'
            >
              {t('ui:goToRina')}
              <HorizontalSeparatorDiv data-size='0.5' />
              <ExternalLink color={linkColor} />
            </HighContrastLink>
            )
          : (
            <WaitingPanel size='S' />
            )}
      </BUCFooterDiv>
    </NavHighContrast>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
