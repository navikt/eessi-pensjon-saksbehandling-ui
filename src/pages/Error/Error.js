import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Nav, EESSIPensjonVeileder } from 'eessi-pensjon-ui'
import TopContainer from 'components/TopContainer/TopContainer'

import './Error.css'

export const Error = ({ history, t, type }) => {
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
          <EESSIPensjonVeileder mood='trist' id='EESSIPensjonVeileder' />
        </div>
        <Nav.Undertittel className='title m-4'>
          {title}
        </Nav.Undertittel>
        <div className='description'>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className='line' />
        <Nav.Normaltekst className='mt-2'>
          {t('ui:error-footer')}
        </Nav.Normaltekst>
      </div>
    </TopContainer>
  )
}

Error.propTypes = {
  history: PT.object.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default withTranslation()(Error)
