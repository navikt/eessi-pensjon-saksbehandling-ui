import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    p4000: state.pinfo.p4000
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class P4000 extends React.Component {
  state = {
    error: {}
  }

  render () {
    const { t, phones, emails, actions } = this.props

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:p4000-title')}</h2>

    </div>
  }
}

P4000.propTypes = {
  locale: PT.string,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(P4000)
)
