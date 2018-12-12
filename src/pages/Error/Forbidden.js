import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'
import * as Nav from '../../components/ui/Nav'

import './Error.css'

const mapStateToProps = (state) => {
  return {
    status: state.status
  }
}

class Forbidden extends Component {
  render () {
    const { t, history, location } = this.props

    return <TopContainer className={classNames('p-error p-error-forbidden')}
      history={history} location={location} header={t('app-headerTitle')}>
      <div className='col-md-12 text-center'>
        <div style={{height: '100px'}} className='mt-3 mb-4'>
          <Psycho type='trist' id='psycho'/>
        </div>
        <Nav.Undertittel className='m-4'>{t('ui:forbidden')}</Nav.Undertittel>
        <Nav.Normaltekst className='mb-4'>{t('ui:forbidden-description')}</Nav.Normaltekst>
        <div style={{width: '60%',  margin: 'auto', borderBottom: '1px solid grey'}}/>
        <Nav.Normaltekst className='mt-2 mb-4'>{t('ui:forbidden-footer')}</Nav.Normaltekst>
      </div>
    </TopContainer>
  }
}

Forbidden.propTypes = {
  t: PT.func.isRequired,
  history: PT.object,
  location: PT.object,
  status: PT.object
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(Forbidden)
)
