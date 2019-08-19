import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {connectToWebSocket} from '../utils/websocket'
import { connect } from '../store'

const logData = (e) => console.log(e.data)

const mapStateToProps = (state) => {
  return {
    personfnr: _.get(state, 'app.person.aktoer.ident.ident', undefined),
    avdodfnr: state.app.params.avdodfnr
  }
}


const WebSocket = (props) => {
  const {personfnr, avdodfnr} = props
  const [connection, setConnection] = useState(null)
  const [ready, setReady] = useState(false)


  useEffect( () => {
      let websocketConnection = connectToWebSocket(()=>setReady(true), logData, logData, logData)
      setConnection(websocketConnection)
    }, []
  )

  useEffect( () => {
    if(connection && ready){
      let message = {subscriptions: [personfnr, avdodfnr].filter(el=>el)}
      connection.send(JSON.stringify(message))
    }

  }, [ready, personfnr, avdodfnr])

  return <div className='WebSocket'></div>

}

export default connect(mapStateToProps, ()=>{})(WebSocket)
