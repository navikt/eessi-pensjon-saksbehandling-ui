/* global WebSocket */

import { alertSuccess } from 'actions/alert'
import { fetchBuc } from 'actions/buc'
import { SuccessFilled, LinkFilled, ErrorFilled } from '@navikt/ds-icons'
import classNames from 'classnames'
import Modal from 'components/Modal/Modal'
import { IS_TEST } from 'constants/environment'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import { rotating, VerticalSeparatorDiv } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from 'declarations/reducers'
import { BucListItem } from 'declarations/buc'

export interface BucWebSocketProps {
  fnr: string | undefined
  avdodFnr: string | undefined
}

const NOTCONNECTED = 'NOTCONNECTED'
const CONNECTING = 'CONNECTING'
const CONNECTED = 'CONNECTED'
const RECEIVING = 'RECEIVING'
const ERROR = 'ERROR'

interface EESSIPen {
  eessipen: any
}
interface WindowEESSIPen extends Window, EESSIPen {}

export const BUCWebsocketDiv = styled.div`
  display: flex;
  button {
    width: 24px;
    height: 24px;
  }
  .log {
    font-size: 0.9rem;
    display: block;
  }
  .info {
    color: white;
  }
  .error {
    color: red;
  }
  .rotating {
    animation: ${rotating} 2s linear infinite;
  }
`
interface WebSocketSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
}

const mapState = (state: State): WebSocketSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId
})

const BucWebSocket: React.FC<BucWebSocketProps> = ({
  fnr, avdodFnr
}: BucWebSocketProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const bucsList: Array<BucListItem> | undefined = useSelector<State, Array<BucListItem> | undefined>((state) => state.buc.bucsList)

  const { aktoerId, sakId }: WebSocketSelector = useSelector<State, WebSocketSelector>(mapState)
  const [_log, setLog] = useState<Array<JSX.Element>>([])
  const [_simpleLog, setSimpleLog] = useState<Array<string>>([])
  const [_modal, _setModal] = useState<boolean>(false)
  const [_status, setStatus] = useState<string>(NOTCONNECTED)
  const [_websocketConnection, setWebsocketConnection] = useState(undefined)

  const onMessageHandler = useCallback((e: MessageEvent) => {
    setStatus(RECEIVING)
    console.log('Receiving websocket message')
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated && data.bucUpdated.caseId) {
        pushToLog('info', 'Updating buc ' + data.bucUpdated.caseId)
        dispatch(alertSuccess(t('ui:websocket-updating-buc', { buc: data.bucUpdated.caseId })))
        const buc: BucListItem | undefined = _.find(bucsList, b => b.euxCaseId === data.bucUpdated.caseId)
        if (buc) {
          dispatch(fetchBuc(data.bucUpdated.caseId, aktoerId, sakId, buc.kilde))
        }
      }
      if (data.subscriptions) {
        pushToLog('info', 'Subscription status is ' + data.subscriptions)
      }
    } catch (err) {
      pushToLog('error', 'Invalid JSON: ' + e.data)
    } finally {
      setStatus(CONNECTED)
    }
  }, [dispatch])

  const websocketSubscribe = useCallback((connection) => {
    const ids:Array<string> = []
    if (fnr) {
      ids.push(fnr)
    }
    if (avdodFnr) {
      ids.push(avdodFnr)
    }
    if (!_.isEmpty(ids)) {
      const message = {
        subscriptions: ids
      }
      connection.send(JSON.stringify(message))
      pushToLog('info', 'Request subscribing to fnr ' + fnr + ' and avdodFnr ' + avdodFnr)
    }
  }, [fnr, avdodFnr])

  const connectToWebSocket: Function = useCallback(() => {
    setStatus(CONNECTING)
    const webSocketURL = (window as unknown as WindowEESSIPen).eessipen
      ? (window as unknown as WindowEESSIPen).eessipen.WEBSOCKETURL.replace('https', 'wss').concat('bucUpdate')
      : WEBSOCKET_LOCALHOST_URL
    pushToLog('info', 'Connecting to ' + webSocketURL + '...')
    const connection: WebSocket = new WebSocket(webSocketURL, 'v0.Buc')
    connection.onopen = () => {
      pushToLog('info', 'Connected')
      setStatus(CONNECTED)
      websocketSubscribe(connection)
    }
    connection.onmessage = onMessageHandler
    connection.onclose = () => {
      pushToLog('info', 'Closed')
      setStatus(NOTCONNECTED)
    }
    connection.onerror = (e) => {
      pushToLog('error', 'Error: ' + JSON.stringify(e))
      setStatus(ERROR)
    }
    return connection
  }, [onMessageHandler, websocketSubscribe])

  useEffect(() => {
    if (!_websocketConnection && (fnr || avdodFnr)) {
      pushToLog('info', 'Got fnr ' + fnr + ' avdodFnr ' + avdodFnr + ', starting websocket connection')
      setWebsocketConnection(connectToWebSocket())
    }
  }, [connectToWebSocket, _websocketConnection, fnr, avdodFnr])

  const pushToLog = (level: string, message: string) => {
    const now: Date = new Date()
    const line: string = now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + ': ' + message
    if (!IS_TEST) {
      /* istanbul ignore next */
      if (level === 'error') {
        console.error(line)
      } else {
        console.log(line)
      }
    }
    setLog(log => [...log, (<BodyLong key={line} className={classNames('log', level)}>{line}</BodyLong>)].slice(-100))
    setSimpleLog(log => [...log, level + ': ' + line].slice(-100))
  }

  const onModalClose = () => _setModal(false)

  const onIconClick = () => {
    _setModal(true)
    console.log(_simpleLog.join('\n'))
  }

  return (
    <BUCWebsocketDiv style={{ cursor: 'pointer' }} title={'websocket: ' + _status}>

      <Modal
        open={_modal}
        modal={{
          closeButton: true,
          modalTitle: t('ui:websocket-log'),
          modalContent: (
            <div style={{ maxWidth: '800px' }}>
              <VerticalSeparatorDiv size='2' />
              {_log}
            </div>
          ),
          modalButtons: [{
            main: true,
            text: 'OK',
            onClick: onModalClose
          }]
        }}
        onModalClose={onModalClose}
      />
      {_status === 'CONNECTED' && (<SuccessFilled color='green' width={24} height={24} onClick={onIconClick} />)}
      {(_status === 'NOTCONNECTED' || _status === 'ERROR') && (
        <ErrorFilled style={{ color: '#A13A28' }} width={24} onClick={onIconClick} />
      )}
      {(_status === 'CONNECTING' || _status === 'RECEIVING') && (<LinkFilled width={24} onClick={onIconClick} />)}

    </BUCWebsocketDiv>
  )
}

BucWebSocket.propTypes = {
  fnr: PT.string.isRequired,
  avdodFnr: PT.string.isRequired
}

export default BucWebSocket
