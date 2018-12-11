import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import PsychoPanel from '../../components/ui/Psycho/PsychoPanel'

const mapStateToProps = (state) => {
  return {
    status: state.status
  }
}

class Forbidden extends Component {
  render () {
    const { t, history, location } = this.props

    return <TopContainer className={classNames('p-error-forbidden')}
      history={history} location={location}>
      <h1 className='typo-sidetittel ml-0 appTitle'>{t('ui:forbidden')}</h1>
       <PsychoPanel id='-psycho-panel' className='mb-4'>
          <span>{t('ui:forbidden')}</span>
       </PsychoPanel>
    </TopContainer>
  }
}

Forbidden.propTypes = {
  t: PT.func.isRequired,
  history: PT.object,
  location: PT.object,
  status: PT.object
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(Forbidden)
)
