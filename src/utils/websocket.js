export function connectToWebSocket (onOpen, onMessage, onClose, onError) {
  const webSocketURL = window.eessipen ? window.eessipen.WEBSOCKETURL.replace('https', 'wss').concat('bucUpdate') : null
  if (!webSocketURL) { return null }
  const connection = new WebSocket(webSocketURL, 'v0.Buc')
  connection.onopen = isFunction(onOpen) ? onOpen : () => {}
  connection.onmessage = isFunction(onMessage) ? onMessage : () => {}
  connection.onclose = isFunction(onClose) ? onClose : () => {}
  connection.onerror = isFunction(onError) ? onError : () => {}
  return connection
}

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}
