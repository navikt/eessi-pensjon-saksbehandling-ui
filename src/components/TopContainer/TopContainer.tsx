import { clientClear, clientError } from 'actions/alert'
import { closeModal, setWidthSize } from 'actions/ui'
import Alert from 'components/Alert/Alert'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Modal from 'components/Modal/Modal'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { WidthSize } from 'declarations/app.d'
import { AlertStatus, ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/person.d'
import _ from 'lodash'
import { themeKeys } from 'nav-styled-component-theme'
import Error from 'pages/Error/Error'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import NavHighContrast from 'nav-hoykontrast'
import styled from 'styled-components'
import useErrorBoundary from 'use-error-boundary'

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
`

export interface TopContainerProps {
  className?: string
  children?: JSX.Element | Array<JSX.Element | null>
  fluid?: boolean
  header?: string | JSX.Element
}

export interface TopContainerSelector {
  clientErrorParam: any | undefined
  clientErrorStatus: AlertStatus | undefined
  clientErrorMessage: string | undefined
  serverErrorMessage: string | undefined
  error: any | undefined
  expirationTime: Date | undefined
  params: {[k: string] : string}
  person: Person | undefined
  username: string | undefined
  gettingUserInfo: boolean
  isLoggingOut: boolean
  footerOpen: boolean
  modal: ModalContent | undefined
  size: WidthSize | undefined
  highContrast: boolean
}

const mapState = (state: State): TopContainerSelector => ({
  clientErrorParam: state.alert.clientErrorParam,
  clientErrorStatus: state.alert.clientErrorStatus,
  clientErrorMessage: state.alert.clientErrorMessage,
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error,

  expirationTime: state.app.expirationTime,
  params: state.app.params,
  person: state.app.person,
  username: state.app.username,

  gettingUserInfo: state.loading.gettingUserInfo,
  isLoggingOut: state.loading.isLoggingOut,

  footerOpen: state.ui.footerOpen,
  modal: state.ui.modal,
  size: state.ui.size,
  highContrast: state.ui.highContrast
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children
}: TopContainerProps): JSX.Element => {
  const {
    clientErrorParam, clientErrorMessage, clientErrorStatus, error, expirationTime, footerOpen,
    gettingUserInfo, highContrast, isLoggingOut, modal, params, serverErrorMessage, size, username
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

  const getClientErrorMessage = (): string | undefined => {
    if (!clientErrorMessage) {
      return undefined
    }
    return t(clientErrorMessage, clientErrorParam)
  }

  const getServerErrorMessage = (): string | undefined => {
    return serverErrorMessage ? t(serverErrorMessage) : undefined
  }

  const onResize = (width: any): void => {
    if (width < 768 && size !== 'sm') {
      dispatch(setWidthSize('sm'))
      return
    }
    if (width < 992 && size !== 'md') {
      dispatch(setWidthSize('md'))
      return
    }
    if (size !== 'lg') {
      dispatch(setWidthSize('lg'))
    }
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg) => {
      dispatch(clientError({ error: msg }))
    }
  }

  return (
    <NavHighContrast highContrast={highContrast}>

      <div role='application'>
        <ErrorBoundary
        renderError={({ error }: any) => <Error type='internalError' error={error} />}
      >
          <ReactResizeDetector
            handleWidth
            onResize={onResize}
          >

        <Header
          highContrast={highContrast}
          username={username}
          gettingUserInfo={gettingUserInfo}
          isLoggingOut={isLoggingOut}
        />
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
        {modal !== undefined && (
          <Modal
            appElement={(document.getElementById('main') || document.body)}
            highContrast={highContrast}
            modal={modal}
            onModalClose={handleModalClose}
          />
        )}
        <SessionMonitor
          expirationTime={expirationTime!}
        />
        <Main
          id='main'
          role='main'
          className={className}
        >
          {children}
        </Main>
        <Footer
          highContrast={highContrast}
          params={params}
          footerOpen={footerOpen}
        />
          </ReactResizeDetector>
      </ErrorBoundary>

      </div>
    </NavHighContrast>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
