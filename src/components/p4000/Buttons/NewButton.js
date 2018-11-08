import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'

import * as p4000Actions from '../../../actions/p4000'
import * as uiActions from '../../../actions/ui'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    event: state.p4000.event
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, p4000Actions), dispatch) }
}

class NewButton extends Component {
  doNewP4000 () {
    const { actions } = this.props

    actions.closeModal()
    actions.newP4000()
  }

  closeModal () {
    const { actions } = this.props

    actions.closeModal()
  }

  handleFileNew () {
    const { t, events, event, actions } = this.props

    if (!_.isEmpty(event) || !_.isEmpty(events)) {
      actions.openModal({
        modalTitle: t('p4000:file-new-confirm-title'),
        modalText: t('p4000:file-new-confirm-text'),
        modalButtons: [{
          main: true,
          text: t('yes') + ', ' + t('continue'),
          onClick: this.doNewP4000.bind(this)
        }, {
          text: t('no') + ', ' + t('cancel'),
          onClick: this.closeModal.bind(this)
        }]
      })
    } else {
      this.doNewP4000()
    }
  }

  render () {
    const { t, style } = this.props

    return <Nav.Knapp title={t('p4000:file-new-description-1') + '\n' + t('p4000:file-new-description-2')}
      style={style} className='bigButton newP4000Button' onClick={this.handleFileNew.bind(this)}>
      <div>
        <Icons className='mr-3' size='3x' kind='plus' />
        <Icons size='4x' kind='file' />
      </div>
      <div className='mt-3'>{t('p4000:file-new')}</div>
    </Nav.Knapp>
  }
}

NewButton.propTypes = {
  t: PT.func.isRequired,
  style: PT.object,
  events: PT.array.isRequired,
  actions: PT.object,
  event: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(NewButton)
)
