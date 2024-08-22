import EESSIPensjonVeileder from 'src/components/EESSIPensjonVeileder/EESSIPensjonVeileder'
import TopContainer from 'src/components/TopContainer/TopContainer'
import { standardLogger, timeLogger } from 'src/metrics/loggers'
import { Accordion, BodyLong, Heading } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
const Line = styled.div`
   width: 60%;
   margin: 1rem;
   min-height: 0.25rem;
   border-bottom: 1px solid ${({ theme }) => theme.navGra60};
`
const Veilder = styled(EESSIPensjonVeileder)`
  height: 110px;
`
export interface ErrorPageProps {
  error?: any
  type: string
  resetErrorBoundary ?: any
}

export const Error: React.FC<ErrorPageProps> = ({ error, type }: ErrorPageProps): JSX.Element => {
  let title, description, footer
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    standardLogger('errorPage.entrance', { type })
    return () => {
      timeLogger('errorPage.view', loggedTime)
    }
  }, [])

  switch (type) {
    case 'forbidden':
    case 'notLogged':
    case 'notInvited':
    case 'internalError':
      title = t('message:error-' + type + '-title')
      description = t('message:error-' + type + '-description')
      footer = t('message:error-' + type + '-footer')
      break
    default:
      title = t('message:error-404-title')
      description = t('message:error-404-description')
      footer = t('message:error-404-footer')
      break
  }

  return (
    <TopContainer>
      <ErrorPageDiv>
        <Veilder
          mood='trist'
          data-testid='p-error--veileder-id'
        />
        <VerticalSeparatorDiv size='2' />
        <Heading size='small' data-testid='p-error--title-id'>
          {title}
        </Heading>
        <Description
          data-testid='p-error--description-id'
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {error && (
          <>
            <Accordion data-testid='p-error--content-error-id'>
              <Accordion.Item>
                <Accordion.Header onClick={() => standardLogger('errorPage.expandingPanel.open')}>
                  {t('message:error-header')}
                </Accordion.Header>
                <Accordion.Content>
                  <div
                    className='error'
                    dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </>
        )}

        {footer && (
          <div data-testid='p-error--footer-id'>
            <Line />
            <VerticalSeparatorDiv />
            <BodyLong>
              {footer}
            </BodyLong>
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
