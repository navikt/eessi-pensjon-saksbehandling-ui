import { clientClear, clientError } from 'actions/alert'
import { closeModal, toggleHighContrast } from 'actions/ui'
import classNames from 'classnames'
import Alert, { AlertStatus } from 'components/Alert/Alert'
import Banner from 'components/Banner/Banner'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Modal from 'components/Modal/Modal'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { ModalContent } from 'declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import useErrorBoundary from 'use-error-boundary'
import Error from 'pages/Error/Error'
import './TopContainer.css'

export interface TopContainerProps {
  className?: string;
  children?: JSX.Element | Array<JSX.Element | null>;
  fluid?: boolean;
  header?: string | JSX.Element;
}

export interface TopContainerSelector {
  clientErrorStatus: AlertStatus | undefined;
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
  highContrast: state.ui.highContrast
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, fluid = true, header
}: TopContainerProps): JSX.Element => {
  const {
    clientErrorMessage, clientErrorStatus, serverErrorMessage, error, expirationTime, params, username, gettingUserInfo,
    isLoggingOut, footerOpen, modal, highContrast
  } = useSelector(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { ErrorBoundary } = useErrorBoundary()

  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  const onClear = (): void => {
    dispatch(clientClear())
  }

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const getClientErrorMessage = (): string | undefined => {
    if (!clientErrorMessage) {
      return undefined
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
      renderError={({ error }: any) => <Error type='internalError' error={error} />}
    >
      <Header
        className={classNames({ highContrast: highContrast })}
        username={username}
        gettingUserInfo={gettingUserInfo}
        isLoggingOut={isLoggingOut}
      >
        {header ? (
          <Banner
            header={header}
            onHighContrastClicked={handleHighContrastToggle}
            labelHighContrast={t('ui:highContrast')}
          />) : null}
        <Alert
          type='client'
          message={getClientErrorMessage()}
          status={clientErrorStatus}
          error={error}
          onClose={onClear}
        />
        <Alert
          type='server'
          message={getServerErrorMessage()}
          error={error}
          onClose={onClear}
        />
        {modal !== undefined ? (
          <Modal
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
  header: PT.any
}

export default TopContainer
