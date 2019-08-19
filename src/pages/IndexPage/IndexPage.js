import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import TopContainer from '../../components/TopContainer/TopContainer'
import Dashboard from '../../components/Dashboard/Dashboard'
import { WEBSOCKET_URL } from 'constants/urls'
import './IndexPage.css'

class IndexPage extends Component {

  //TODO remove/refactor. testing websocket from frontend
  connectToWebSocket = () => {
    let conn = new WebSocket(WEBSOCKET_URL, 'v0.eessiBuc')
    conn.onopen = e => console.log(e.data)
    conn.onmessage = e => console.log(e.data)
    conn.onclose = e => console.log(e.data)
    conn.onerror = e => console.log(e.data)
    return conn
  }

  //TODO remove/refactor. testing websocket from frontend
  componentDidMount() {
    let websocketConnection
    if(WEBSOCKET_URL) {
      websocketConnection = this.connectToWebSocket()
      websocketConnection.send('{"subscriptions": ["aktoerId"]}')
    }
  }

  render () {
    const { history, t } = this.props

    return <TopContainer
      className='p-indexPage'
      t={t}
      history={history}>
      <Dashboard id='dashboard' />
    </TopContainer>
  }
}

IndexPage.propTypes = {
  history: PT.object.isRequired,
  t: PT.func.isRequired
}

export default withTranslation()(IndexPage)
