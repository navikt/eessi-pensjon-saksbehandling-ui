import React, { Component } from 'react'
import { connect, bindActionCreators } from 'store'

import * as uiActions from '../../../actions/ui'
import './Banner.css'
import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

export class Banner extends Component {
  toggleHighContrast () {
    const { actions } = this.props
    actions.toggleHighContrast()
  }

  render () {
    const { t, header } = this.props
    return <div className='c-ui-banner'>
      <a className='c-ui-highcontrast-link mt-1' href='#highContrast' onClick={this.toggleHighContrast.bind(this)}>{t('highContrast')}</a>
      <h1 className='typo-undertittel m-4 pt-4 pb-4 text-center appTitle'>{header}</h1>
    </div>
  }
}

const ConnectedBanner = connect(
  mapStateToProps,
  mapDispatchToProps
)(Banner)

ConnectedBanner.displayName = `Connect(${getDisplayName(Banner)}`

export default ConnectedBanner
