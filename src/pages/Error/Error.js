import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import TopContainer from 'components/TopContainer/TopContainer'
import Psycho from 'components/Psycho/Psycho'
import { Normaltekst, Undertittel } from 'components/Nav'

import './Error.css'

export const Error = (props) => {

  const { history, t, type } = props
  
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

  return <TopContainer
    className={classNames('p-error')}
    t={t}
    history={history}
    header={t('app-headerTitle')}>
    <div className='col-md-12 text-center'>
      <div className='psycho mt-3 mb-4'>
        <Psycho type='trist' id='psycho' />
      </div>
      <Undertittel className='m-4'>
        {title}
      </Undertittel>
      <Normaltekst className='mb-4'>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </Normaltekst>
      <div className='line' />
      <Normaltekst className='mt-2 mb-4'>
        {t('ui:error-footer')}
      </Normaltekst>
    </div>
  </TopContainer>
}

Error.propTypes = {
  history: PT.object.isRequired,
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default withTranslation()(Error)
