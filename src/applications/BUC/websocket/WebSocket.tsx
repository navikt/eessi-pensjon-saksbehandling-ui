/* global WebSocket */

import { fetchSingleBuc } from 'actions/buc'
import classNames from 'classnames'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import { IS_TEST } from 'constants/environment'
import { WEBSOCKET_LOCALHOST_URL } from 'constants/urls'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Popover, { PopoverOrientering } from 'nav-frontend-popover'
import LineCheckCircle from 'assets/icons/line-version-check-circle-2'
import FilledNetworkConnecting from 'assets/icons/filled-version-network-connecting'
import styled, { keyframes } from 'styled-components'

export interface BucWebSocketProps {
  fnr: string | undefined
  avdodfnr: string | undefined
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

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const BUCWebsocketDiv = styled.div`
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
    color: @white;
  }
  .error {
    color: @redError;
  }
  .rotating {
    animation: ${rotating} 2s linear infinite;
  }
`

const BucWebSocket: React.FC<BucWebSocketProps> = ({
  fnr, avdodfnr
}: BucWebSocketProps): JSX.Element => {
  const [status, setStatus] = useState<string>(NOTCONNECTED)
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | undefined>(undefined)
  const [log, setLog] = useState<Array<JSX.Element>>([])
  const [simpleLog, setSimpleLog] = useState<Array<string>>([])
  const [websocketConnection, setWebsocketConnection] = useState(undefined)
  const dispatch = useDispatch()

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
    const ids = []
    if (fnr) {
      ids.push(fnr)
    }
    if (avdodfnr) {
      ids.push(avdodfnr)
    }
    if (!_.isEmpty(ids)) {
      const message = {
        subscriptions: ids
      }
      connection.send(JSON.stringify(message))
      pushToLog('info', 'Request subscribing to fnr ' + fnr + ' and avdodfnr ' + avdodfnr)
    }
  }, [fnr, avdodfnr])

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
    if (!websocketConnection && (fnr || avdodfnr)) {
      pushToLog('info', 'Got fnr ' + fnr + ' avdodfnr ' + avdodfnr + ', starting websocket connection')
      setWebsocketConnection(connectToWebSocket())
    }
  }, [connectToWebSocket, websocketConnection, fnr, avdodfnr])

  const pushToLog = (level: string, message: string) => {
    const now = new Date()
    const line = now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + ': ' + message
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
    switch (status) {
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

  const handleClick = (e: React.MouseEvent<any>) => {
    if (!popoverOpen) {
      console.log(simpleLog.join('\n'))
    }
    setPopoverAnchor(popoverOpen ? undefined : e.currentTarget)
    setPopoverOpen(!popoverOpen)
  }

  return (
    <BUCWebsocketDiv title={'websocket: ' + status}>
      <Icon kind={getAnchor()} size={24} onClick={handleClick} />
      <Popover orientering={PopoverOrientering.Under} ankerEl={popoverAnchor}>{log}</Popover>
    </BUCWebsocketDiv>
  )
}

BucWebSocket.propTypes = {
  fnr: PT.string,
  avdodfnr: PT.string
}

export default BucWebSocket
