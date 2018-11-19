import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'

import Icons from '../Icons'

import * as appActions from '../../../actions/app'
import * as uiActions from '../../../actions/ui'
import * as alertActions from '../../../actions/alert'

import './Breadcrumbs.css'

const mapStateToProps = (state) => {
  return {
    breadcrumbs: state.ui.breadcrumbs
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, alertActions, uiActions, appActions), dispatch) }
}

class Breadcrumbs extends Component {
  onBreadcrumbClick (breadcrumb, e) {
    e.preventDefault()

    const { history, actions } = this.props

    actions.clientClear()
    actions.trimBreadcrumbsTo(breadcrumb)
    history.push(breadcrumb.url)
  }

  render () {
    let { t, className, breadcrumbs } = this.props

    return <div className={classNames('c-ui-breadcrumbs', 'breadcrumb', className)}>
      {breadcrumbs ? breadcrumbs.map((b, index) => {
        return <div key={b.label} title={b.url} className='_breadcrumb'>
          {index === (breadcrumbs.length - 1) ? t(b.label)
            : <React.Fragment>
              <button className='breadcrumbButton' title={t(b.label)} onClick={this.onBreadcrumbClick.bind(this, b)}>{t(b.label)}</button>
              <span className='separator'>
                <Icons kind='caretRight' size='1x' />
              </span>
            </React.Fragment>
          }
        </div>
      }) : null}
      <div style={{ position: 'absolute', right: '2rem' }}>
        <a href='mailto:eessipensjon@nav.no'>{t('ui:giveFeedback')}</a>
      </div>
    </div>
  }
}

Breadcrumbs.propTypes = {
  t: PT.func,
  breadcrumbs: PT.array,
  actions: PT.object.isRequired,
  history: PT.object.isRequired,
  className: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Breadcrumbs)
)
