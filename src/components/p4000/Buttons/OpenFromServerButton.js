import React, { Component } from 'react'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Icons from '../../ui/Icons'
import * as Nav from '../../ui/Nav'
import P4000Util from '../Util'

import * as uiActions from '../../../actions/ui'
import * as storageActions from '../../../actions/storage'
import * as p4000Actions from '../../../actions/p4000'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, storageActions, p4000Actions), dispatch) }
}

class OpenFromServerButton extends Component {
  openFile (file) {
    const { actions } = this.props

    let events = P4000Util.readEvents(file.content)
    if (typeof events === 'string') {
      actions.openP4000Failure(events)
    } else {
      actions.openP4000Success(events)
    }
  }

  closeModal () {
    const { actions } = this.props

    actions.closeModal()
  }

  handleFileOpenFromServer () {
    const { t, actions, event, events } = this.props

    if (!_.isEmpty(event) || !_.isEmpty(events)) {
      actions.openModal({
        modalTitle: t('p4000:file-open-confirm-title'),
        modalText: t('p4000:file-open-confirm-text'),
        modalButtons: [{
          main: true,
          text: t('yes') + ', ' + t('continue'),
          onClick: this.doOpenP4000FromServer.bind(this)
        }, {
          text: t('no') + ', ' + t('cancel'),
          onClick: this.closeModal.bind(this)
        }]
      })
    } else {
      this.doOpenP4000FromServer()
    }
  }

  doOpenP4000FromServer () {
    const { actions } = this.props

    actions.closeModal()
    actions.openStorageModal({
      action: 'open',
      onFileSelected: this.openFile.bind(this)
    })
  }

  render () {
    const { t, style } = this.props

    return <Nav.Knapp
      title={t('p4000:file-open-from-server-description-1') + '\n' +
            t('p4000:file-open-from-server-description-2') + '\n' +
            t('p4000:file-open-from-server-description-3')}
      style={style}
      className='bigButton openP4000FromServerButton'
      onClick={this.handleFileOpenFromServer.bind(this)}>
      <div>
        <Icons size='3x' className='mr-3' kind='server' />
        <Icons className='mr-3' size='3x' kind='caretRight' />
        <Icons size='4x' kind='document' />
      </div>
      <div className='mt-3'>{t('p4000:file-open-from-server')}</div>
    </Nav.Knapp>
  }
}

OpenFromServerButton.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  style: PT.object,
  actions: PT.object,
  event: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(OpenFromServerButton)
)
