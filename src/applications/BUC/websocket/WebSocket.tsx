/* global WebSocket */

import { fetchSingleBuc } from 'actions/buc'
import FilledNetworkConnecting from 'assets/icons/filled-version-network-connecting'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import LineCheckCircle from 'assets/icons/line-version-check-circle-2'
import classNames from 'classnames'
import { rotating } from 'nav-hoykontrast'
import { IS_TEST } from 'constants/environment'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Tooltip from 'rc-tooltip'

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

const BucWebSocket: React.FC<BucWebSocketProps> = ({
  fnr, avdodFnr
}: BucWebSocketProps): JSX.Element => {
  const dispatch = useDispatch()

  const [_log, setLog] = useState<Array<JSX.Element>>([])
  const [_simpleLog, setSimpleLog] = useState<Array<string>>([])
  const [_status, setStatus] = useState<string>(NOTCONNECTED)
  const [_websocketConnection, setWebsocketConnection] = useState(undefined)

  const onMessageHandler = useCallback((e: MessageEvent) => {
    setStatus(RECEIVING)
    console.log('Receiving websocket message')
    try {
      const data = JSON.parse(e.data)
      if (data.bucUpdated && data.bucUpdated.caseId) {
        pushToLog('info', 'Updating buc ' + data.bucUpdated.caseId)
        dispatch(fetchSingleBuc(data.bucUpdated.caseId))
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
      pushToLog('error', 'Error: ' + e)
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
    setLog(log => [...log, (<span key={line} className={classNames('log', level)}>{line}</span>)].slice(-100))
    setSimpleLog(log => [...log, level + ': ' + line].slice(-100))
  }

  const getAnchor = () => {
    switch (_status) {
      case CONNECTED:
        return LineCheckCircle
      case NOTCONNECTED:
      case ERROR:
        return FilledRemoveCircle
      case CONNECTING:
      case RECEIVING:
        return FilledNetworkConnecting
      default:
        return FilledNetworkConnecting
    }
  }

  const Icon = getAnchor()

  return (
    <BUCWebsocketDiv title={'websocket: ' + _status}>
      <Tooltip
        placement='top' trigger={['click']} overlay={(<div className='logs'>{_log}</div>)}
      >
        <Icon size={24} onClick={() => console.log(_simpleLog.join('\n'))} />
      </Tooltip>
    </BUCWebsocketDiv>
  )
}

BucWebSocket.propTypes = {
  fnr: PT.string.isRequired,
  avdodFnr: PT.string.isRequired
}

export default BucWebSocket
