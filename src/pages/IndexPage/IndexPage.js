import React, { Component } from 'react'
import PT from 'prop-types'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import EmptyDrawer from '../../components/drawer/Empty'
import Dashboard from '../../components/ui/Dashboard/Dashboard'
import './IndexPage.css'

class IndexPage extends Component {

  render () {
    const {  language, history, location } = this.props

    return <TopContainer className='p-indexPage'
      language={language} history={history} location={location}
      sideContent={<EmptyDrawer />}
      fluid={true}>
      <Dashboard/>
    </TopContainer>
  }
}

IndexPage.propTypes = {
  language: PT.string,
  location: PT.object.isRequired,
  history: PT.object.isRequired
}

export default IndexPage
