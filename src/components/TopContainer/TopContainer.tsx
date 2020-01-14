import * as alertActions from 'actions/alert'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import classNames from 'classnames'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import SnowStorm from 'react-snowstorm'
import { bindActionCreators, connect } from 'store'
import { ActionCreators, Dispatch, State, T } from 'types.d'
import './TopContainer.css'

export interface TopContainerProps {
  actions: ActionCreators;
  children?: JSX.Element | Array<JSX.Element | null>;
  clientErrorMessage ?: string;
  clientErrorStatus ?: string;
  error?: any;
  expirationTime?: Date;
  fluid?: boolean;
  footerOpen: boolean;
  gettingUserInfo: boolean;
  header: string | JSX.Element;
  history: any;
  highContrast?: boolean;
  isLoggingOut?: boolean;
  modal?: any;
  params: any;
  serverErrorMessage?: string;
  snow: boolean;
  t: T;
  username: string;
}

const mapStateToProps = /* istanbul ignore next */ (state: State) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    error: state.alert.error,
    expirationTime: state.app.expirationTime,
    params: state.app.params,
    username: state.app.username,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingOut: state.loading.isLoggingOut,
    footerOpen: state.ui.footerOpen,
    modal: state.ui.modal,
    snow: state.ui.snow,
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = /* istanbul ignore next */ (dispatch: Dispatch) => {
  return { actions: bindActionCreators({ ...alertActions, ...appActions, ...uiActions }, dispatch) }
}

export const TopContainer: React.FC<TopContainerProps> = ({
  actions, children, clientErrorMessage, clientErrorStatus, error,
  expirationTime, fluid = true, footerOpen, gettingUserInfo, header, history,
  highContrast, isLoggingOut, modal, params, serverErrorMessage, snow, t, username
}: TopContainerProps): JSX.Element => {
  const handleModalClose = (): void => {
    actions.closeModal()
  }

  const onClear = (): void => {
    actions.clientClear()
  }

  const handleHighContrastToggle = (): void => {
    actions.toggleHighContrast()
  }

  const getClientErrorMessage = (): string | null => {
    if (!clientErrorMessage) {
      return null
    }
    const separatorIndex: number = clientErrorMessage.lastIndexOf('|')
    let message: string
    if (separatorIndex >= 0) {
      message = t(clientErrorMessage.substring(0, separatorIndex)) + ': ' + clientErrorMessage.substring(separatorIndex + 1)
    } else {
      message = t(clientErrorMessage)
    }
    return message
  }

  const getServerErrorMessage = (): string | undefined => {
    return serverErrorMessage ? t(serverErrorMessage) : undefined
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg) => {
      actions.clientError({ message: msg })
    }
  }

  return (
    <>
      {snow ? <SnowStorm /> : null}
      <Header
        actions={actions}
        className={classNames({ highContrast: highContrast })}
        t={t}
        history={history}
        username={username}
        gettingUserInfo={gettingUserInfo}
        isLoggingOut={isLoggingOut}
        snow={snow}
      >
        {header ? (
          <Ui.Banner
            header={header}
            onHighContrastClicked={handleHighContrastToggle}
            labelHighContrast={t('ui:highContrast')}
          />) : null}
        <Ui.Alert
          type='client'
          message={getClientErrorMessage()}
          status={clientErrorStatus}
          error={error}
          onClose={onClear}
        />
        <Ui.Alert
          type='server'
          message={getServerErrorMessage()}
          error={error}
          onClose={onClear}
        />
        {modal ? (
          <Ui.Modal
            appElement={document.getElementById('main')}
            modal={modal}
            onModalClose={handleModalClose}
          />
        ) : null}
        <SessionMonitor
          t={t}
          actions={actions}
          expirationTime={expirationTime!}
        />
      </Header>
      <main id='main' role='main' className={classNames('_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
      <Footer
        className={classNames({ highContrast: highContrast })}
        actions={actions}
        params={params}
        footerOpen={footerOpen}
      />
    </>
  )
}

TopContainer.propTypes = {
  actions: PT.oneOf<ActionCreators>([]).isRequired,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any,
  history: PT.object.isRequired,
  highContrast: PT.bool,
  t: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TopContainer)
