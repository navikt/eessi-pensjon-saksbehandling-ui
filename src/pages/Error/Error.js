import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'
import * as Nav from '../../components/ui/Nav'

import './Error.css'

class Error extends Component {
  render () {
    const { t, history, location, type } = this.props

    let title, description, footer

    switch(type) {

       case 'forbidden':
          title = t('ui:forbidden')
          description = t('ui:forbidden-description')
          footer = t('ui:forbidden-footer')
          break
       case 'notInvited':
          title = t('ui:notInvited')
          description = t('ui:notInvited-description')
          footer = t('ui:notInvited-footer')
          break
       default:
          title = t('ui:error')
          description = t('ui:error-description')
          footer = t('ui:error-footer')
          break
    }

    return <TopContainer className={classNames('p-error')}
      history={history} location={location} header={t('app-headerTitle')}>
      <div className='col-md-12 text-center'>
        <div className='psycho mt-3 mb-4'>
          <Psycho type='trist' id='psycho'/>
        </div>
        <Nav.Undertittel className='m-4'>{title}</Nav.Undertittel>
        <Nav.Normaltekst className='mb-4'>{description}</Nav.Normaltekst>
        <div className='line'/>
        <Nav.Normaltekst className='mt-2 mb-4'>{footer}</Nav.Normaltekst>
      </div>
    </TopContainer>
  }
}

Error.propTypes = {
  t: PT.func.isRequired,
  type: PT.string.isRequired
}

export default withNamespaces()(Error)
