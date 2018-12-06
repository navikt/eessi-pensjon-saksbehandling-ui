import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'
import classNames from 'classnames'

import VeilederPanel from '../../../components/ui/Panel/VeilederPanel'
import StepIndicator from '../../../components/pdf/StepIndicator'
import ExternalFiles from '../../../components/pdf/ExternalFiles/ExternalFiles'
import * as Nav from '../../../components/ui/Nav'
import TopContainer from '../../../components/ui/TopContainer/TopContainer'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import PdfDrawer from '../../../components/drawer/Pdf'

import * as routes from '../../../constants/routes'
import * as pdfActions from '../../../actions/pdf'
import * as uiActions from '../../../actions/ui'
import * as appActions from '../../../actions/app'

import './SelectPDF.css'

const mapStateToProps = (state) => {
  return {
    loadingPDF: state.loading.loadingPDF,
    language: state.ui.language,
    files: state.pdf.files
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, uiActions, pdfActions), dispatch) }
}

class SelectPDF extends Component {
  componentDidMount () {
    const { actions } = this.props

    actions.registerDroppable('selectPdf', this.fileUpload)
  }

  componentWillUnmount () {
    const { actions } = this.props

    actions.unregisterDroppable('selectPdf')
  }

  onForwardButtonClick () {
    const { history } = this.props

    history.push(routes.PDF_EDIT)
  }

  handleFileChange (files) {
    const { actions } = this.props

    actions.selectPDF(files)
  }

  handleBeforeDrop () {
    const { actions } = this.props

    actions.loadingFilesStart()
  }

  handleAfterDrop () {
    const { actions } = this.props

    actions.loadingFilesEnd()
  }

  addFile (file) {
    this.fileUpload.getWrappedInstance().addFile(file)
  }

  render () {
    const { t, history, loadingPDF, files, location } = this.props

    let buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward')

    return <TopContainer className='p-pdf-selectPdf'
      history={history} location={location}
      sideContent={<PdfDrawer />}>
      <h1 className='typo-sidetittel appTitle'>{t('pdf:app-selectPdfTitle')}</h1>
      <StepIndicator stepIndicator={0} history={history} />
      <div className='fieldset animate mb-4 '>
        <VeilederPanel>{t('pdf:app-selectPdfDescription')}</VeilederPanel>
      </div>

      <ExternalFiles addFile={this.addFile.bind(this)} />

      <div style={{ animation: 'none', opacity: 1 }} className='fieldset mt-4 mb-4'>
        <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
        <FileUpload t={t} ref={f => { this.fileUpload = f }} fileUploadDroppableId={'selectPdf'}
          className={classNames('fileUpload', 'mb-3')}
          accept={['application/pdf', 'image/jpeg', 'image/png']}
          files={files || []}
          beforeDrop={this.handleBeforeDrop.bind(this)}
          afterDrop={this.handleAfterDrop.bind(this)}
          onFileChange={this.handleFileChange.bind(this)} />
      </div>
      <Nav.Hovedknapp
        className='forwardButton'
        spinner={loadingPDF}
        disabled={_.isEmpty(files)}
        onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
    </TopContainer>
  }
}

SelectPDF.propTypes = {
  loadingPDF: PT.bool,
  actions: PT.object,
  history: PT.object,
  t: PT.func,
  files: PT.array.isRequired,
  location: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(SelectPDF)
)
