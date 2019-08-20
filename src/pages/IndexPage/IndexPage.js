import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import TopContainer from '../../components/TopContainer/TopContainer'
import Dashboard from '../../components/Dashboard/Dashboard'
import './IndexPage.css'

class IndexPage extends Component {

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
