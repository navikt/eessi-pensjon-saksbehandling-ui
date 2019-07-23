import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'
import * as Nav from '../../components/ui/Nav'

import './Error.css'

class Error extends Component {
  render () {
    const { t, history, location, type } = this.props
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
        <Nav.Undertittel className='m-4'>{title}</Nav.Undertittel>
        <Nav.Normaltekst className='mb-4'>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Nav.Normaltekst>
        <div className='line' />
        <Nav.Normaltekst className='mt-2 mb-4'>{t('ui:error-footer')}</Nav.Normaltekst>
      </div>
    </TopContainer>
  }
}

Error.propTypes = {
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default withTranslation()(Error)
