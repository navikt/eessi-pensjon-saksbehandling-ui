import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import SummaryRender from './SummaryRender'
import Icons from '../../../ui/Icons'
import * as Nav from '../../../ui/Nav'

import * as routes from '../../../../constants/routes'
import * as p4000Actions from '../../../../actions/p4000'

import './Summary.css'
import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    comment: state.p4000.comment,
    username: state.app.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Summary extends Component {
  onBackButtonClick () {
    const { history } = this.props
    history.goBack()
  }

  componentDidMount () {
    const { events, history } = this.props
    if (_.isEmpty(events)) {
      history.replace(routes.P4000)
    }
    window.scrollTo(0, 0)
  }

  render () {
    const { t, events, comment, username } = this.props

    return <Nav.Panel className='c-p4000-menu c-p4000-menu-summary p-0 mb-4'>
      <div className='title m-3'>
        <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
          <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
        </Nav.Knapp>
        <Icons size='3x' kind={'view'} className='float-left mr-4' />
        <h1 className='m-0'>{t('p4000:file-summary')}</h1>
      </div>
      <SummaryRender t={t}
        events={events}
        comment={comment}
        username={username}
        previewAttachments
        blackAndWhite={false} />
    </Nav.Panel>
  }
}

Summary.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Summary)
)
