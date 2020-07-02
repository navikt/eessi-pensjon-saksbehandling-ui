import ExternalLink from 'assets/icons/line-version-logout'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import Lenke from 'nav-frontend-lenker'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
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
const Link = styled(Lenke)`
  display: flex;
  align-items: flex-end
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
  const linkColor = highContrast ? themeHighContrast['main-interactive-color'] : theme['main-interactive-color']

  if (!rinaUrl) {
    return <div />
  }
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCFooterDiv className={className}>
        <Link
          data-amplitude='buc.list.rinaurl'
          id='a-buc-c-buclist__gotorina-link'
          className='a-buc-c-buclist__gotorina'
          href={rinaUrl}
          target='rinaWindow'
          onClick={linkLogger}
        >
          {t('ui:goToRina')}
          <HorizontalSeparatorDiv data-size='0.5' />
          <ExternalLink color={linkColor} />
        </Link>
      </BUCFooterDiv>
    </ThemeProvider>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
