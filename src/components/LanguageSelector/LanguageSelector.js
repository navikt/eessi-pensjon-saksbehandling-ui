import React, { Component } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import i18n from '../../i18n'
import classNames from 'classnames'

import * as Nav from './Nav'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

class LanguageSelector extends Component {
  changeLanguage (e) {
    let { actions } = this.props

    actions.changeLanguage(e.target.value)
  }

  render () {
    let { language, className } = this.props
    let _language = language || i18n.language

    return <Nav.Select
      bredde='l'
      className={classNames('c-languageSelector', className)}
      label={'Velg språk / Choose language'}
      value={_language} onChange={this.changeLanguage.bind(this)}>
      <option value='en'>{'English'}</option>
      <option value='nb'>{'Norsk Bokmål'}</option>
    </Nav.Select>
  }
}

LanguageSelector.propTypes = {
  language: PT.string,
  className: PT.string,
  actions: PT.object.isRequired
}

const ConnectedLanguageSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector)

export default ConnectedLanguageSelector
