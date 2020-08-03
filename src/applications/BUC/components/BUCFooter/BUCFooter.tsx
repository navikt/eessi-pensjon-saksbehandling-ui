import ExternalLink from 'assets/icons/line-version-logout'
import { HighContrastLink, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

export interface BUCFooterProps {
  className ?: string
}

export interface BUCFooterSelector {
  highContrast: boolean
  rinaUrl: RinaUrl | undefined
}

const BUCFooterDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const mapState = (state: State): BUCFooterSelector => ({
  highContrast: state.ui.highContrast,
  rinaUrl: state.buc.rinaUrl
})
const BUCFooter: React.FC<BUCFooterProps> = ({
  className
}: BUCFooterProps): JSX.Element => {
  const { t } = useTranslation()
  const { highContrast, rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)
  const _theme = highContrast ? themeHighContrast : theme
  const linkColor = _theme[themeKeys.MAIN_INTERACTIVE_COLOR]

  if (!rinaUrl) {
    return <div />
  }
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCFooterDiv className={className}>
        <HighContrastLink
          data-amplitude='buc.list.rinaurl'
          data-testid='a-buc-c-buclist__gotorina-link'
          href={rinaUrl}
          target='rinaWindow'
          onClick={linkLogger}
        >
          {t('ui:goToRina')}
          <HorizontalSeparatorDiv data-size='0.5' />
          <ExternalLink color={linkColor} />
        </HighContrastLink>
      </BUCFooterDiv>
    </ThemeProvider>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
