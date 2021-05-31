import EESSIPensjonVeileder from 'components/EESSIPensjonVeileder/EESSIPensjonVeileder'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { standardLogger, timeLogger } from 'metrics/loggers'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Description = styled.div`
  width: 80%;
  margin: 1rem;
  text-align: center;
`
export const ErrorPageDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const ErrorPanel = styled(ExpandingPanel)`
  min-width: 50%;
`
const Line = styled.div`
   width: 60%;
   margin: 1rem;
   min-height: 0.25rem;
   border-bottom: 1px solid ${({ theme }) => theme.navGra60};
`
const Title = styled(Undertittel)``
const Veilder = styled(EESSIPensjonVeileder)`
  height: 110px;
`
export interface ErrorPageProps {
  error?: any
  type: string
  resetErrorBoundary ?: any
}

export interface ErrorPageSelector {
  highContrast: boolean
}

const mapState = (state: State): ErrorPageSelector => ({
  highContrast: state.ui.highContrast
})

export const Error: React.FC<ErrorPageProps> = ({ error, type }: ErrorPageProps): JSX.Element => {
  let title, description, footer
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState<boolean>(false)
  const { highContrast } = useSelector<State, ErrorPageSelector>(mapState)

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
      <ErrorPageDiv>
        <Veilder
          mood='trist'
          data-test-id='p-error__veileder-id'
        />
        <VerticalSeparatorDiv size='2' />
        <Title data-test-id='p-error__title-id'>
          {title}
        </Title>
        <Description
          data-test-id='p-error__description-id'
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {error && (
          <ErrorPanel
            collapseProps={{ id: 'p-error__content-error-id' }}
            highContrast={highContrast}
            data-test-id='p-error__content-error-id'
            id='p-error__content-error-id'
            onOpen={() => standardLogger('errorPage.expandingPanel.open')}
            heading={t('ui:error-header')}
          >
            <div
              className='error'
              dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }}
            />
          </ErrorPanel>
        )}
        {footer && (
          <div data-test-id='p-error__footer-id'>
            <Line />
            <VerticalSeparatorDiv />
            <Normaltekst>
              {footer}
            </Normaltekst>
          </div>
        )}
      </ErrorPageDiv>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any,
  type: PT.string.isRequired
}

export default Error
