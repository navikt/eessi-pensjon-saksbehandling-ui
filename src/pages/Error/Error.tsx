import EESSIPensjonVeileder from 'components/EESSIPensjonVeileder/EESSIPensjonVeileder'
import { HighContrastExpandingPanel, VerticalSeparatorDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { standardLogger, timeLogger } from 'metrics/loggers'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export interface ErrorProps {
  error?: any
  type: string
}

const ContentDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Veilder = styled(EESSIPensjonVeileder)`
  height: 110px;
`
const Title = styled(Undertittel)``

const Description = styled.div`
  width: 80%;
  margin: 1rem;
  text-align: center;
`
const ErrorPanel = styled(HighContrastExpandingPanel)`
  min-width: 50%;
`

const Line = styled.div`
   width: 60%;
   margin: 1rem;
   min-height: 0.25rem;
   border-bottom: 1px solid ${({ theme }: any) => theme.navGra60};
`

export interface ErrorSelector {
  highContrast: boolean
}

const mapState = (state: State): ErrorSelector => ({
  highContrast: state.ui.highContrast
})

export const Error = ({ error, type }: ErrorProps) => {
  let title, description, footer
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState<boolean>(false)
  const { highContrast } = useSelector<State, ErrorSelector>(mapState)

  useEffect(() => {
    if (!mounted) {
      standardLogger('errorPage.entrance', { type: type })
      setMounted(true)
    }
    return () => {
      timeLogger('errorPage.view', loggedTime)
    }
  }, [loggedTime, mounted, type])

  switch (type) {
    case 'forbidden':
    case 'notLogged':
    case 'notInvited':
    case 'internalError':
      title = t('ui:error-' + type + '-title')
      description = t('ui:error-' + type + '-description')
      footer = t('ui:error-' + type + '-footer')
      break
    default:
      title = t('ui:error-404-title')
      description = t('ui:error-404-description')
      footer = t('ui:error-404-footer')
      break
  }

  return (
    <TopContainer>
      <ContentDiv>
        <Veilder
          mood='trist'
          data-testid='EESSIPensjonVeileder'
        />
        <VerticalSeparatorDiv data-size='2' />
        <Title>
          {title}
        </Title>
        <Description
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {error && (
          <ErrorPanel
            highContrast={highContrast}
            id='p-error__content-error-id'
            onClick={() => standardLogger('errorPage.expandingPanel.open')}
            heading={t('ui:error-header')}
          >
            <div
              className='error'
              dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }}
            />
          </ErrorPanel>
        )}
        {footer && (
          <>
            <Line />
            <VerticalSeparatorDiv />
            <Normaltekst>
              {footer}
            </Normaltekst>
          </>
        )}
      </ContentDiv>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any,
  type: PT.string.isRequired
}

export default Error
