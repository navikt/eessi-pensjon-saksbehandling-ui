import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Dashboard from '../../components/ui/Dashboard/Dashboard'
import './IndexPage.css'

class IndexPage extends Component {
  render () {
    const { language, history, location, t } = this.props

    return <TopContainer
      className='p-indexPage'
      t={t}
      containerClassName='p-0'
      language={language} history={history} location={location}
      fluid>
      <Dashboard id='dashboard' />
    </TopContainer>
  }
}

IndexPage.propTypes = {
  language: PT.string,
  location: PT.object.isRequired,
  history: PT.object.isRequired,
  t: PT.func.isRequired
}

export default withTranslation()(IndexPage)
