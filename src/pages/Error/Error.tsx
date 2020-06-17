import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import Ui from 'eessi-pensjon-ui'
import { standardLogger, timeLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Error.css'

export interface ErrorProps {
  error?: any;
  type: string;
}

export const Error = ({ error, type }: ErrorProps) => {
  let title, description, footer
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState<boolean>(false)

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
    <TopContainer className={classNames('p-error')}>
      <div className='p-error__content'>
        <div className='EESSIPensjonVeileder'>
          <Ui.EESSIPensjonVeileder
            mood='trist'
            id='EESSIPensjonVeileder'
          />
        </div>
        <Ui.Nav.Undertittel className='title m-5'>
          {title}
        </Ui.Nav.Undertittel>
        <div
          className='description'
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {error && (
          <Ui.ExpandingPanel
            id='p-error__content-error-id'
            onClick={() => standardLogger('errorPage.expandingPanel.open')}
            className={classNames('p-error__content-error', 's-border')}
            heading={t('ui:error-header')}
            style={{ minWidth: '50%' }}
          >
            <div
              className='error'
              dangerouslySetInnerHTML={{ __html: '<pre>' + error.stack + '</pre>' }}
            />
          </Ui.ExpandingPanel>
        )}
        {footer && (
          <>
            <div className='line' />
            <Ui.Nav.Normaltekst className='mt-2 footer'>
              {footer}
            </Ui.Nav.Normaltekst>
          </>
        )}
      </div>
    </TopContainer>
  )
}

Error.propTypes = {
  error: PT.any,
  type: PT.string.isRequired
}

export default Error
