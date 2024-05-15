import { alertClear, alertFailure } from 'src/actions/alert'
import { closeModal, setWidthSize } from 'src/actions/ui'
import BannerAlert from 'src/components/BannerAlert/BannerAlert'
import Header from 'src/components/Header/Header'
import Modal from 'src/components/Modal/Modal'
import { Params, WidthSize } from 'src/declarations/app.d'
import { AlertVariant, ModalContent } from 'src/declarations/components'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import Error from 'src/pages/Error/Error'
import PT from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import styled, { createGlobalStyle } from 'styled-components'
import { ErrorBoundary } from 'react-error-boundary'

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: var(--a-bg-subtle);
  color:  var(--a-color-text-primary);
`
const TopContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    background-color: var(--a-bg-subtle);
  }
  pre {
    font-family: 'Source Sans Pro', Arial, sans-serif;
  }
  code.block {
    display: block;
    white-space: pre-wrap;
  }
  dd {
    margin-bottom: .5rem;
    margin-left: 0;
  }
  ol {
    list-style-type: decimal;
  }

  .print-version {
    width: 100%;
    margin-top: 0.5rem;
    @media print {
      @page {
        size: A4 landscape;
      }
      td {
        padding: 0.5rem;
      }
    }
  }
`

export interface TopContainerProps {
  className?: string
  children?: JSX.Element | Array<JSX.Element | null>
  fluid?: boolean
  header?: string | JSX.Element
  indexType?: string
}

export interface TopContainerSelector {
  bannerStatus: string | undefined
  bannerMessage: string | JSX.Element | undefined
  error: any | undefined
  footerOpen: boolean
  gettingUserInfo: boolean
  isLoggingOut: boolean
  modal: ModalContent | undefined
  params: Params
  size: WidthSize | undefined
  username: string | undefined
}

const mapState = (state: State): TopContainerSelector => ({
  bannerStatus: state.alert.bannerStatus,
  bannerMessage: state.alert.bannerMessage,
  error: state.alert.error,

  params: state.app.params,
  username: state.app.username,

  gettingUserInfo: state.loading.gettingUserInfo,
  isLoggingOut: state.loading.isLoggingOut,

  footerOpen: state.ui.footerOpen,
  modal: state.ui.modal,
  size: state.ui.size,
})

export const TopContainer: React.FC<TopContainerProps> = ({
  className, children, indexType = "PESYS"
}: TopContainerProps): JSX.Element => {
  const {
    bannerStatus, bannerMessage, error,
    gettingUserInfo, isLoggingOut, modal, size, username
  } = useSelector(mapState)
  const dispatch = useDispatch()

  const handleModalClose = (): void => {
    dispatch(closeModal())
  }

  const onClear = (): void => {
    dispatch(alertClear())
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
    <div >
      <GlobalStyle />
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
              key="topContainer-header"
              indexType={indexType}
            />
            <BannerAlert
              message={bannerMessage}
              variant={bannerStatus as AlertVariant}
              error={error}
              onClose={onClear}
              key="topContainer-bannerAlert"
            />
            {modal !== undefined && (
              <Modal
                modal={modal}
                open={!_.isNil(modal)}
                onModalClose={handleModalClose}
                key="topContainer-modal"
              />
            )}
            <Main
              id='main'
              role='main'
              className={className}
              key="topContainer-main"
            >
              {children}
            </Main>
          </ReactResizeDetector>
        </ErrorBoundary>
      </TopContainerDiv>
    </div>
  )
}

TopContainer.propTypes = {
  className: PT.string,
  children: PT.any,
  fluid: PT.bool,
  header: PT.any
}

export default TopContainer
