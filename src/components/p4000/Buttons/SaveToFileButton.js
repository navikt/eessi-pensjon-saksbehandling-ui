import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
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
    events: state.p4000.events,
    comment: state.p4000.comment
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, storageActions, p4000Actions), dispatch) }
}

class SaveToFileButton extends Component {
    state = {}

    handleFileSaveToFile () {
      const { events, comment } = this.props

      this.setState({
        fileOutput: 'data:text/json;charset=utf-8,' + P4000Util.writeP4000ToString({
          events: events,
          comment: comment
        })
      }, () => {
        this.fileOutput.click()
      })
    }

    render () {
      const { t, events, style } = this.props

      return <React.Fragment>
        <a className='hiddenFileInputOutput' ref={fileOutput => { this.fileOutput = fileOutput }}
          href={this.state.fileOutput} download='p4000.json'>&nbsp;</a>
        <Nav.Knapp
          title={t('p4000:file-save-to-file-description-1') + '\n' +
               t('p4000:file-save-to-file-description-2') + '\n' +
               t('p4000:file-save-to-file-description-3')}
          style={style}
          className='bigButton saveP4000ToFileButton'
          disabled={_.isEmpty(events)}
          onClick={this.handleFileSaveToFile.bind(this)}>
          <div>
            <Icons className='mr-3' size='4x' kind='document' />
            <Icons size='3x' kind='download' />
          </div>
          <div className='mt-3'>{t('p4000:file-save-to-file')}</div>
        </Nav.Knapp>
      </React.Fragment>
    }
}

SaveToFileButton.propTypes = {
  t: PT.func.isRequired,
  events: PT.array.isRequired,
  style: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(SaveToFileButton)
)
