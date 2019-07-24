import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'

import * as uiActions from 'actions/ui'
import {Container } from 'components/Nav'
import Alert from 'components/Alert/Alert'
import Banner from 'components/Banner/Banner'
import Modal from 'components/Modal/Modal'
import InternalTopHeader from 'components/Header/InternalTopHeader'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { getDisplayName } from 'utils/displayName'

import './TopContainer.css'

const mapStateToProps = (state) => {
  return {
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = (dispatch) => {
   return { actions: bindActionCreators(uiActions, dispatch) }
}

export const TopContainer = (props) => {

  const { actions, className, children, fluid = true, header, history, highContrast, remainingTime, style, t } = props

  return <div style={style}
    className={classNames('c-topContainer', className, { 'highContrast': highContrast })}>
    <InternalTopHeader t={t} history={history} />
    {header ? <Banner t={t} header={header} toggleHighContrast={actions.toggleHighContrast} /> : null}
    <Alert type='client' t={t} />
    <Alert type='server' t={t} />
    <Container fluid={fluid} className='_container p-0'>
      {children}
    </Container>
    <Modal />
    <SessionMonitor t={t}/>
    <Footer />
  </div>
}

TopContainer.propTypes = {
  actions: PT.object.isRequired,
  children: PT.node.isRequired,
  className: PT.string,
  style: PT.object,
  history: PT.object.isRequired,
  header: PT.oneOfType([PT.node, PT.string])
}

const ConnectedTopContainer = connect(mapStateToProps, mapDispatchToProps)(TopContainer)
ConnectedTopContainer.displayName = `Connect(${getDisplayName(TopContainer)})`
export default ConnectedTopContainer
