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
      <div className='col-md-12'>
        <Psycho style={{width: '70%', height: '70%'}} type='trist' id='psycho' className='mb-4'/>
      </div>
      <div className='col-md-12 text-center'>
        <Nav.Undertittel >{t('ui:forbidden')}</Nav.Undertittel>
        <Nav.Normaltekst>{t('ui:forbidden-description')}</Nav.Normaltekst>
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
