import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './Error.css'

export interface ErrorProps {
  error?: any;
  history?: any;
  type: string;
}

export const Error = ({ error, history, type }: ErrorProps) => {
  let title, description
  const { t } = useTranslation()
  switch (type) {
    case 'forbidden':
      title = t('ui:error-saksbehandler-forbidden-title')
      description = t('ui:error-saksbehandler-forbidden-description')
      break
    case 'notLogged':
      title = t('ui:error-notLogged-title')
      description = t('ui:error-notLogged-description')
      break
    case 'notInvited':
      title = t('ui:error-saksbehandler-notInvited-title')
      description = t('ui:error-saksbehandler-notInvited-description')
      break
    case 'internalError':
      title = t('ui:error-internalError-title')
      description = t('ui:error-internalError-description')
      break
    default:
      title = t('ui:error-404-title')
      description = t('ui:error-404-description')
      break
  }

  return (
    <TopContainer
      className={classNames('p-error')}
      history={history}
    >
      <div className='p-error__content'>
        <div className='EESSIPensjonVeileder'>
          <Ui.EESSIPensjonVeileder mood='trist' id='EESSIPensjonVeileder' />
        </div>
        <Ui.Nav.Undertittel className='title m-4'>
          {title}
        </Ui.Nav.Undertittel>
        <div className='description'>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {error ? JSON.stringify(error) : null}
        <div className='line' />
        <Ui.Nav.Normaltekst className='mt-2'>
          {t('ui:error-footer')}
        </Ui.Nav.Normaltekst>
      </div>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any,
  history: PT.any,
  type: PT.string.isRequired
}

export default Error
