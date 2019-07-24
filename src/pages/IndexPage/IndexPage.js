import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import TopContainer from '../../components/TopContainer/TopContainer'
import Dashboard from '../../components/Dashboard/Dashboard'
import './IndexPage.css'

class IndexPage extends Component {
  render () {
    const { history, language, t } = this.props

    return <TopContainer
      className='p-indexPage'
      t={t}
      history={history}
      containerClassName='p-0'
      language={language}
      fluid>
      <Dashboard id='dashboard' />
    </TopContainer>
  }
}

IndexPage.propTypes = {
  language: PT.string,
  history: PT.object.isRequired,
  t: PT.func.isRequired
}

export default withTranslation()(IndexPage)
