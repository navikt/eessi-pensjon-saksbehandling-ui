import { clientClear, clientError } from 'actions/alert'
import { closeModal, toggleHighContrast } from 'actions/ui'
import classNames from 'classnames'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import Ui from 'eessi-pensjon-ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SnowStorm from 'react-snowstorm'
import { State } from 'declarations/reducers'
import useErrorBoundary from 'use-error-boundary'
import Error from 'pages/Error/Error'
import './TopContainer.css'

export interface TopContainerProps {
  className?: string;
  children?: JSX.Element | Array<JSX.Element | null>;
  fluid?: boolean;
  header?: string | JSX.Element;
  history: any;
}

export interface TopContainerSelector {
  clientErrorStatus: string | undefined;
  clientErrorMessage: string | undefined;
  serverErrorMessage: string | undefined;
  error: any | undefined;
  expirationTime: Date | undefined;
  params: {[k: string] : string};
  username: string | undefined;
  gettingUserInfo: boolean;
  isLoggingOut: boolean;
  footerOpen: boolean;
  modal: ModalContent | undefined;
  snow: boolean;
  highContrast: boolean;
}

const mapState = (state: State): TopContainerSelector => ({
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
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, fluid = true, header, history
}: TopContainerProps): JSX.Element => {
  const {
    clientErrorMessage, clientErrorStatus, serverErrorMessage, error, expirationTime, params, username, gettingUserInfo,
    isLoggingOut, footerOpen, modal, snow, highContrast
  } = useSelector(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const {
    ErrorBoundary, // class - The react component to wrap your children in. This WILL NOT CHANGE
   // didCatch, // boolean - Whether the ErrorBoundary catched something
   _error, // null or the error
   // errorInfo // null or the error info as described in the react docs
  } = useErrorBoundary()


  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  const onClear = (): void => {
    dispatch(clientClear())
  }

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
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
      dispatch(clientError({ error: msg }))
    }
  }

  return (
    <ErrorBoundary
      renderError={({ error }: any) => <Error type='internalError' error={_error}/>}
    >
      {snow ? <SnowStorm /> : null}
      <Header
        className={classNames({ highContrast: highContrast })}
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
        {modal !== undefined ? (
          <Ui.Modal
            appElement={(document.getElementById('main') || document.body)}
            modal={modal}
            onModalClose={handleModalClose}
          />
        ) : null}
        <SessionMonitor
          expirationTime={expirationTime!}
        />
      </Header>
      <main id='main' role='main' className={classNames(className, '_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
      <Footer
        className={classNames({ highContrast: highContrast })}
        params={params}
        footerOpen={footerOpen}
      />
    </ErrorBoundary>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any,
  history: PT.object.isRequired
}

export default TopContainer
