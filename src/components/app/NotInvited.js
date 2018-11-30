import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import FrontPageDrawer from '../../components/drawer/FrontPage'

const mapStateToProps = (state) => {
  return {
    status: state.status
  }
}

class NotInvited extends Component {
  render () {
    const { t, history, location, status } = this.props

    return <TopContainer className={classNames('p-app-notInvited')}
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}>
      <h1 className='typo-sidetittel ml-0 appTitle'>{'not invited'}</h1>
    </TopContainer>
  }
}

NotInvited.propTypes = {
  t: PT.func.isRequired,
  history: PT.object,
  location: PT.object,
  status: PT.object
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(NotInvited)
)
