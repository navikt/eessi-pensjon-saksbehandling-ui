import { alertClear, alertFailure } from 'actions/alert'
import { closeModal, setWidthSize } from 'actions/ui'
import Alert from 'components/Alert/Alert'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Modal from 'components/Modal/Modal'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { Params, WidthSize } from 'declarations/app.d'
import { AlertVariant, ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import Error from 'pages/Error/Error'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import NavHighContrast from 'nav-hoykontrast'
import styled from 'styled-components'
import { ErrorBoundary } from 'react-error-boundary'
import { IS_PRODUCTION } from 'constants/environment'

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: var(--navds-semantic-color-canvas-background);
  color:  var(--navds-color-text-primary);
`
const TopContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
export interface TopContainerProps {
  className?: string
  children?: JSX.Element | Array<JSX.Element | null>
  fluid?: boolean
  header?: string | JSX.Element
}

export interface TopContainerSelector {
  clientErrorParam: any | undefined
  clientErrorStatus: AlertVariant | undefined
  clientErrorMessage: string | undefined
  error: any | undefined
  expirationTime: Date | undefined
  footerOpen: boolean
  gettingUserInfo: boolean
  highContrast: boolean
  isLoggingOut: boolean
  modal: ModalContent | undefined
  params: Params
  serverErrorMessage: string | undefined
  size: WidthSize | undefined
  username: string | undefined
}

const mapState = (state: State): TopContainerSelector => ({
  clientErrorParam: state.alert.clientErrorParam,
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

  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  const onClear = (): void => {
    dispatch(alertClear())
  }

  const getErrorMessage = (): string | undefined => {
    if (serverErrorMessage) {
      return t(serverErrorMessage)
    }
    if (clientErrorMessage) {
      return t(clientErrorMessage, clientErrorParam)
    }
    return undefined
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
      dispatch(alertFailure(_.isString(msg) ? msg : JSON.stringify(msg as Event)))
    }
  }

  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <Error type='internalError' error={error} resetErrorBoundary={resetErrorBoundary} />
  )

  return (
    <NavHighContrast highContrast={highContrast}>

      <TopContainerDiv role='application'>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}
        >
          <ReactResizeDetector
            handleWidth
            onResize={onResize}
          >

            <Header
              username={username}
              gettingUserInfo={gettingUserInfo}
              isLoggingOut={isLoggingOut}
            />
            <Alert
              message={getErrorMessage()}
              variant={clientErrorStatus}
              error={error}
              onClose={onClear}
            />
            {modal !== undefined && (
              <Modal
                appElementId='main'
                modal={modal}
                open={!_.isNil(modal)}
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
            {!IS_PRODUCTION && (
              <Footer
                params={params}
                footerOpen={footerOpen}
              />
            )}
          </ReactResizeDetector>
        </ErrorBoundary>
      </TopContainerDiv>
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
