import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import TopContainer from 'components/TopContainer/TopContainer'
import { T } from 'declarations/types'
import './Error.css'

export interface ErrorProps {
  history: any;
  t: T;
  type: string;
}

export const Error = ({ history, t, type }: ErrorProps) => {
  let title, description

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
    default:
      title = t('ui:error-404-title')
      description = t('ui:error-404-description')
      break
  }

  return (
    <TopContainer
      className={classNames('p-error')}
      t={t}
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
        <div className='line' />
        <Ui.Nav.Normaltekst className='mt-2'>
          {t('ui:error-footer')}
        </Ui.Nav.Normaltekst>
      </div>
    </TopContainer>
  )
}

Error.propTypes = {
  history: PT.object.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

// @ts-ignore
export default withTranslation()(Error)
