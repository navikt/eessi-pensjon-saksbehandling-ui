import EESSIPensjonVeileder from 'src/components/EESSIPensjonVeileder/EESSIPensjonVeileder'
import TopContainer from 'src/components/TopContainer/TopContainer'
import {Accordion, BodyLong, Heading, VStack} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Description = styled.div`
  width: 80%;
  margin: 1rem;
  text-align: center;
`
export const ErrorPageDiv = styled(VStack)`
  align-items: center;
  justify-content: center;
`
const Line = styled.div`
   width: 60%;
   margin: 1rem;
   min-height: 0.25rem;
   border-bottom: 1px solid ${({ theme }) => theme.navGra60};
`
const Veileder = styled(EESSIPensjonVeileder)`
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
      <ErrorPageDiv
        gap="4"
        data-testid='p-error--top-container-id'
      >
        <Veileder
          mood='trist'
          data-testid='p-error--veileder-id'
        />
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
                <Accordion.Header>
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
          <VStack data-testid='p-error--footer-id'>
            <Line />
            <BodyLong>
              {footer}
            </BodyLong>
          </VStack>
        )}
      </ErrorPageDiv>
    </TopContainer>
  )
}

export default Error
