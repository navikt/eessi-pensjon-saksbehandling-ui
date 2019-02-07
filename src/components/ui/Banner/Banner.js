import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as uiActions from '../../../actions/ui'
import './Banner.css'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

class Banner extends Component {
  toggleHighContrast () {
    const { actions } = this.props
    actions.toggleHighContrast()
  }

  render () {
    const { t, header } = this.props
    return <div className='c-ui-banner'>
      <a className='c-ui-highcontrast-link mt-1' href='#' onClick={this.toggleHighContrast.bind(this)}>{t('highContrast')}</a>
      <h1 className='typo-undertittel m-0 pt-4 pb-4 text-center appTitle'>{header}</h1>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Banner)
)
