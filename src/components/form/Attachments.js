import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'
import classNames from 'classnames'

import * as Nav from '../ui/Nav'
import FileUpload from '../ui/FileUpload/FileUpload'
import getError from './shared/getError'

import * as appActions from '../../actions/app'
import * as pinfoActions from '../../actions/pinfo'
import {attachmentValidation} from '../pinfo/tests'

const mapStateToProps = (state) => {
  return {
    attachments: state.pinfo.form.attachments
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, pinfoActions), dispatch) }
}

function setAttachmentTypes (payload, key) {
  this.props.actions.setAttachmentTypes({ [key]: payload.target.checked } )
}
function setAttachments (payload) {
  this.props.actions.setAttachments(payload)
}
function displayErrorOff () {
  this.setState({
    displayError: false
  })
}
function displayErrorOn () {
  this.setState({
    displayError: true
  })
}

class Attachments extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayError: true
    }
    this.setAttachmentTypes = setAttachmentTypes.bind(this)
    this.setAttachments = setAttachments.bind(this)
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }
  }

  componentDidMount () {
    const { actions } = this.props
    actions.registerDroppable('pinfoAttachments', this.fileUpload)
  }

  componentWillUnmount () {
    const { actions } = this.props
    actions.unregisterDroppable('pinfoAttachments')
  }

  render () {
    let validType = attachmentValidation.attachmentTypes(this.props.attachments, this.props.t)
    let validAttachment = attachmentValidation.attachments(this.props.attachments, this.props.t)
    let requiredCheckbox = this.props.requireCheckBox && validType
    let requiredFileUpload = this.props.requireUpload && validAttachment
    return (
      <fieldset>
        <legend>{this.props.t('pinfo:form-attachments')}</legend>
        <Nav.SkjemaGruppe className='pinfo-fileupload-SkjemaGruppe'>
          <Nav.Row>
            <div className='col-md-12'>
                <Nav.CheckboksPanelGruppe
                legend={this.props.t('pinfo:form-attachmentTypes')}
                onChange={this.setAttachmentTypes}
                feil={this.state.displayError && validType? {feilmelding: validType}: null}
                checkboxes={ _.range(1, 5).map(i=>{
                  let index = i.toString(10).padStart(2, '0')
                  return {
                    label: this.props.t(`pinfo:form-attachmentTypes-${index}`),
                    value: index,
                    id: index,
                    inputProps: {
                      required: requiredCheckbox,
                      defaultChecked: this.props.attachments.attachmentTypes ?
                        this.props.attachments.attachmentTypes[index] || false:
                        false
                    }
              } } )
            
            }
                />
            </div>
          </Nav.Row>
          <Nav.SkjemaGruppe 
            feil={this.state.displayError && validAttachment? {feilmelding: validAttachment}: null}
          >
            <div className='pinfo-fileupload'>
              <FileUpload
                t={this.props.t} ref={f => { this.fileUpload = f }}
                fileUploadDroppableId={'pinfoAttachments'}
                files={
                  this.props.attachments.attachments
                  && Array.isArray(this.props.attachments.attachments)?
                  this.props.attachments.attachments : []
                }
                inputProps={{
                  required: requiredFileUpload,
                }}
                onFileChange={this.setAttachments}
                tabIndex='0'
              />
            </div>
          </Nav.SkjemaGruppe>
        </Nav.SkjemaGruppe>
      </fieldset>
    )
  }
}

Attachments.propTypes = {
  checkboxes: PT.array,
  files: PT.array,
  checkboxAction: PT.func,
  fileUploadAction: PT.func,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
    withNamespaces()(Attachments)
)