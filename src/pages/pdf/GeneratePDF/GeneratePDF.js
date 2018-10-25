import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../../../components/ui/Nav'
import StepIndicator from '../../../components/pdf/StepIndicator'
import TopContainer from '../../../components/ui/TopContainer/TopContainer'
import File from '../../../components/ui/File/File'
import PdfDrawer from '../../../components/drawer/Pdf'
import StorageModal from '../../../components/ui/Modal/StorageModal'

import * as routes from '../../../constants/routes'
import * as storages from '../../../constants/storages'
import * as pdfActions from '../../../actions/pdf'
import * as uiActions from '../../../actions/ui'
import * as storageActions from '../../../actions/storage'

import './GeneratePDF.css'

const mapStateToProps = (state) => {
  return {
    generatingPDF: state.loading.generatingPDF,
    language: state.ui.language,
    generatedPDFs: state.pdf.generatedPDFs,
    files: state.pdf.files,
    watermark: state.pdf.watermark,
    recipe: state.pdf.recipe
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions, uiActions, storageActions), dispatch) }
}

class GeneratePDF extends Component {
    state = {
      fileNames: {}
    };

    static getDerivedStateFromProps (props, state) {
      if (!_.isEmpty(props.generatedPDFs) && _.isEmpty(state.fileNames)) {
        let fileNames = {}

        Object.keys(props.generatedPDFs).map(key => {
          fileNames[key] = props.generatedPDFs[key].name
          return key
        })

        return {
          fileNames: fileNames
        }
      }
      return {}
    }

    componentDidMount () {
      const { history, actions, files, recipe, watermark } = this.props

      if (!files || _.isEmpty(files)) {
        history.push(routes.PDF_SELECT)
      } else {
        actions.generatePDF({
          recipe: recipe,
          files: files,
          watermark: watermark
        })
      }

      actions.addToBreadcrumbs({
        url: routes.PDF_GENERATE,
        ns: 'pdf',
        label: 'pdf:app-generatePdfTitle'
      })
    }

    onBackButtonClick () {
      const { history, actions } = this.props

      actions.navigateBack()
      history.push(routes.PDF_EDIT)
    }

    onForwardButtonClick () {
      const { history, actions } = this.props

      actions.navigateForward()
      actions.clearPDF()
      history.push(routes.PDF_SELECT)
    }

    setFileName (key, e) {
      let newFileNames = _.clone(this.state.fileNames)
      newFileNames[key] = e.target.value

      this.setState({
        fileNames: newFileNames
      })
    }

    downloadAll () {
      const { generatedPDFs } = this.props

      Object.keys(generatedPDFs).map(key => {
        this[key].click()
        return key
      })
    }

    handleFileSaveToServer (pdf, fileName) {
      const { actions } = this.props

      let _pdf = _.clone(pdf)
      delete _pdf.content.data

      actions.openStorageModal({
        action: 'save',
        blob: _pdf,
        mimetype: 'application/pdf',
        name: fileName
      })
    }

    render () {
      const { t, history, generatingPDF, generatedPDFs, location } = this.props
      let buttonText = generatingPDF ? t('pdf:loading-generatingPDF') : t('ui:startAgain')

      return <TopContainer className='p-pdf-generatePDF'
        history={history} location={location}
        sideContent={<PdfDrawer />}>
        <Nav.HjelpetekstBase>{t('pdf:help-generate-pdf')}</Nav.HjelpetekstBase>
        <h1 className='appTitle'>{t('pdf:app-generatePdfTitle')}</h1>
        <StorageModal namespace={storages.FILES} />
        <StepIndicator stepIndicator={2} history={history} />
        {generatingPDF ? <div className='w-100 text-center'>
          <Nav.NavFrontendSpinner />
          <p>{t('pdf:loading-generatingPDF')}</p>
        </div> : (generatedPDFs ? <div>
          {Object.keys(generatedPDFs).map(key => {
            let pdf = generatedPDFs[key]
            return <div key={key} className='fieldset animate'>
              <div className='row pdfrow'>
                <div className='col-sm-4'>
                  <File file={pdf} />
                </div>
                <div className='col-sm-4'>
                  <Nav.Input label={t('ui:filename')} value={this.state.fileNames[key]}
                    onChange={this.setFileName.bind(this, key)} />
                </div>
                <div className='col-sm-4 text-right'>
                  <a className='hiddenLink' ref={item => { this[key] = item }}
                    onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(pdf.content.base64)}
                    download={this.state.fileNames[key]}>{t('ui:download')}</a>
                  <Nav.Knapp className='downloadButton'
                    onClick={() => this[key].click()}>
                    {t('ui:download')}
                  </Nav.Knapp>
                  <Nav.Knapp className='saveToServerButton'
                    onClick={this.handleFileSaveToServer.bind(this, pdf, this.state.fileNames[key])}>
                    {t('ui:saveToServer')}
                  </Nav.Knapp>
                </div>
              </div>
            </div>
          })}
          <div className='text-right m-4'>
            <Nav.Knapp className='downloadAllButton' onClick={this.downloadAll.bind(this)}>{t('ui:downloadAll')}</Nav.Knapp>
          </div>
        </div> : null)}
        <Nav.Row className='p-4'>
          <Nav.Column>
            <Nav.Knapp className='backButton w-100' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
          </Nav.Column>
          <Nav.Column>
            <Nav.Hovedknapp disabled={generatingPDF} className='forwardButton w-100' onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
          </Nav.Column>
        </Nav.Row>
      </TopContainer>
    }
}

GeneratePDF.propTypes = {
  generatingPDF: PT.bool,
  actions: PT.object,
  history: PT.object,
  t: PT.func,
  files: PT.array.isRequired,
  recipe: PT.object.isRequired,
  generatedPDFs: PT.object,
  location: PT.object.isRequired,
  watermark: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(GeneratePDF)
)
