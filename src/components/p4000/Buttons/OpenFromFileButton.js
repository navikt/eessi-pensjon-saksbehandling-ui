/* global Uint8Array */

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
import * as p4000Actions from '../../../actions/p4000'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, p4000Actions), dispatch) }
}

class OpenFromFileButton extends Component {
    state = {}

    doOpenP4000FromFile () {
      const { actions } = this.props

      actions.closeModal()
      this.fileInput.click()
    }

    closeModal () {
      const { actions } = this.props

      actions.closeModal()
    }

    handleFileOpenFromFile () {
      const { t, actions, event, events } = this.props

      if (!_.isEmpty(event) || !_.isEmpty(events)) {
        actions.openModal({
          modalTitle: t('p4000:file-open-confirm-title'),
          modalText: t('p4000:file-open-confirm-text'),
          modalButtons: [{
            main: true,
            text: t('yes') + ', ' + t('continue'),
            onClick: this.doOpenP4000FromFile.bind(this)
          }, {
            text: t('no') + ', ' + t('cancel'),
            onClick: this.closeModal.bind(this)
          }]
        })
      } else {
        this.doOpenP4000FromFile()
      }
    }

    handleFileInputClick (e) {
      const { actions } = this.props

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(e.target.files[0])
        reader.onloadend = (e) => {
          let string = String.fromCharCode.apply(null, new Uint8Array(e.target.result))
          let events = P4000Util.readEventsFromString(string)
          if (typeof events === 'string') {
            actions.openP4000Failure(events)
            reject(events)
          } else {
            actions.openP4000Success(events)
            resolve(events)
          }
          window.scrollTo(0, 0)
          this.fileInput.value = ''
        }
        reader.onerror = error => reject(error)
      })
    }

    render () {
      const { t, style } = this.props

      return <React.Fragment>
        <input className='hiddenFileInputOutput' type='file' ref={fileInput => { this.fileInput = fileInput }}
          onChange={this.handleFileInputClick.bind(this)} />
        <Nav.Knapp
          title={t('p4000:file-open-from-file-description-1') + '\n' +
                t('p4000:file-open-from-file-description-2') + '\n' +
                t('p4000:file-open-from-file-description-3') + '\n' +
                t('p4000:file-open-from-file-description-4')}
          style={style}
          className='bigButton openP4000FromFileButton'
          onClick={this.handleFileOpenFromFile.bind(this)}>
          <div>
            <Icons className='mr-3' size='3x' kind='upload' />
            <Icons size='4x' kind='file' />
          </div>
          <div className='mt-3'>{t('p4000:file-open-from-file')}</div>
        </Nav.Knapp>

      </React.Fragment>
    }
}

OpenFromFileButton.propTypes = {
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
  translate()(OpenFromFileButton)
)
