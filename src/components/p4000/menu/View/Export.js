/* global Blob */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import print from 'print-js'
import { withRouter } from 'react-router'

import SummaryRender from './SummaryRender'
import Icons from '../../../ui/Icons'

import * as Nav from '../../../ui/Nav'
import PdfUtils from '../../../ui/Print/PdfUtils'

import * as routes from '../../../../constants/routes'
import * as p4000Actions from '../../../../actions/p4000'
import * as pdfActions from '../../../../actions/pdf'
import * as storageActions from '../../../../actions/storage'

import './Export.css'
import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    comment: state.p4000.comment,
    username: state.app.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions, p4000Actions, storageActions), dispatch) }
}

class Export extends Component {
  state = {
    blackAndWhite: false,
    includeAttachments: true,

    doingPreview: false,
    doingDownload: false,
    doingPrint: false,

    // if I generate a PDF for preview and then request to print/download, I do not need to generate again,
    // but if I tamper with print options before request print/download, then I do need to generate it
    needToGeneratePDF: true,
    tab: 'panel-1',

    pdf: undefined,
    previewPdf: undefined
  }

  onBackButtonClick () {
    const { history } = this.props
    history.goBack()
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  async onPdfPreviewRequest () {
    const { events } = this.props
    const { includeAttachments } = this.state

    this.setState({
      doingPreview: true
    })
    try {
      console.log('Generating a PDF for preview')
      let pdf = await PdfUtils.createPdf({
        nodeId: 'divToPrint',
        includeAttachments: includeAttachments,
        events: events
      })
      this.setState({
        previewPdf: pdf,
        needToGeneratePDF: false
      })
    } catch (e) {
      console.log('Failure to generate PDF', e)
    }
    this.setState({
      doingPreview: false
    })
  }

  async onDownloadRequest () {
    const { events } = this.props
    const { includeAttachments } = this.state

    if (this.state.needToGeneratePDF === false && this.state.previewPdf) {
      console.log('Skipping generating PDF, reusing previewPdf')
      this.setState({
        pdf: this.state.previewPdf
      }, () => {
        this.downloadLink.click()
      })
    } else {
      console.log('Generating PDF, previewPdf is old')

      this.setState({
        doingDownload: true
      })

      try {
        let pdf = await PdfUtils.createPdf({
          nodeId: 'divToPrint',
          useCanvas: true,
          includeAttachments: includeAttachments,
          events: events
        })
        this.setState({
          pdf: pdf
        }, () => {
          this.downloadLink.click()
        })
      } catch (e) {
        console.log('Failure to generate PDF', e)
      }
      this.setState({
        doingDownload: false
      })
    }
  }

  async onPrintRequest () {
    const { events } = this.props
    const { includeAttachments } = this.state

    if (this.state.needToGeneratePDF === false && this.state.previewPdf) {
      console.log('Skipping generating PDF, reusing previewPdf')
      this.setState({
        pdf: this.state.previewPdf
      }, () => {
        const pdfBlob = new Blob([
          PdfUtils.base64toData(this.state.pdf.content.base64)
        ], { type: 'application/pdf' })
        const url = URL.createObjectURL(pdfBlob)
        print(url)
      })
    } else {
      this.setState({
        doingPrint: true
      })

      console.log('Generating PDF, previewPdf is old')
      try {
        let pdf = await PdfUtils.createPdf({

          nodeId: 'divToPrint',
          includeAttachments: includeAttachments,
          events: events
        })
        this.setState({
          pdf: pdf
        }, () => {
          const pdfBlob = new Blob([
            PdfUtils.base64toData(pdf.content.base64)
          ], { type: 'application/pdf' })
          const url = URL.createObjectURL(pdfBlob)
          print(url)
        })
      } catch (e) {
        console.log('NO PDF FOR YOU')
      }
      this.setState({
        doingPrint: false
      })
    }
  }

  onAdvancedEditRequest () {
    const { history, actions } = this.props

    actions.selectPDF([this.state.previewPdf])
    history.push(routes.PDF_EDIT)
  }

  setCheckbox (key, e) {
    this.setState({
      [key]: e.target.checked,
      needToGeneratePDF: true
    })
  }

  onTabChange (e) {
    this.setState({
      tab: e.currentTarget.id
    })
  }

  onSaveRequest (e) {
    const { actions } = this.props

    actions.openStorageModal({
      action: 'save',
      blob: this.state.previewPdf,
      mimetype: 'application/pdf',
      name: this.state.previewPdf.name
    })
  }

  render () {
    const { t, events, comment, username } = this.props
    const { includeAttachments, blackAndWhite, pdf, previewPdf, doingPreview, doingPrint, doingDownload } = this.state

    return <Nav.Panel className='c-p4000-menu c-p4000-menu-export p-0 mb-4'>
      <div className='title m-4'>
        <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
          <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
        </Nav.Knapp>
        <Icons size='3x' kind={'export'} className='float-left mr-4' />
        <h1 className='m-0'>{t('p4000:file-export')}</h1>
      </div>
      <div className='row'>

        <div className='col-md-3'>
          <div style={{ marginTop: '6rem' }}>
            <Nav.Checkbox label={t('includeAttachments')}
              checked={includeAttachments}
              onChange={this.setCheckbox.bind(this, 'includeAttachments')} />

            <Nav.Checkbox label={t('blackAndWhite')}
              checked={blackAndWhite}
              onChange={this.setCheckbox.bind(this, 'blackAndWhite')} />

            <a className='hiddenLink' ref={item => { this.downloadLink = item }}
              onClick={(e) => e.stopPropagation()} title={t('ui:download')}
              href={pdf ? 'data:application/octet-stream;base64,' + encodeURIComponent(pdf.content.base64) : '#'}
              download={'p4000.pdf'}>{t('ui:download')}</a>

            <Nav.Knapp className='exportButton downloadButton mb-2' onClick={this.onDownloadRequest.bind(this)}
              disabled={doingDownload}
              spinner={doingDownload}>
              <Icons kind='download' size='1x' />
              {doingDownload ? t('renderingPdf') : t('download')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton printButton' onClick={this.onPrintRequest.bind(this)}
              disabled={doingPrint}
              spinner={doingPrint}>
              <Icons kind='print' size='1x' />
              {doingPrint ? t('renderingPdf') : t('print')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton saveButton'
              disabled={previewPdf === undefined}
              onClick={this.onSaveRequest.bind(this)}>
              <Icons kind='save' size='1x' />
              {t('saveToServer')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton advancedEditButton'
              onClick={this.onAdvancedEditRequest.bind(this)}
              disabled={previewPdf === undefined}>
              <Icons kind='tool' size='1x' />
              {t('advancedEdit')}
            </Nav.Knapp>
          </div>
        </div>
        <div className='col-md-9'>
          <Nav.Tabs onChange={this.onTabChange.bind(this)}>
            <Nav.Tabs.Tab id='panel-1'>{t('content')}</Nav.Tabs.Tab>
            <Nav.Tabs.Tab id='panel-2'>{t('preview')}</Nav.Tabs.Tab>
          </Nav.Tabs>
          <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-1' })} role='tabpanel' id='panel-1'>
            <div id='divToPrint'>
              <SummaryRender t={t}
                events={events}
                comment={comment}
                username={username}
                animate={false}
                previewAttachments={false}
                blackAndWhite={blackAndWhite}
              />
            </div>
          </div>
          <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-2' })} role='tabpanel' id='panel-2'>
            <Nav.Knapp
              style={{ minHeight: '50px' }}
              className='pdfPreviewButton'
              onClick={this.onPdfPreviewRequest.bind(this)}
              disabled={doingPreview}
              spinner={doingPreview}>
              <Icons className='mr-2' kind='print' size='1x' />
              {doingPreview ? t('renderingPreview') : t('pdfPreview')}
            </Nav.Knapp>

            { previewPdf ? <embed style={{ width: '100%', height: '70vh' }}
              type='application/pdf'
              src={'data:application/pdf;base64,' + encodeURIComponent(previewPdf.content.base64)} /> : null}
          </div>
        </div>
      </div>
    </Nav.Panel>
  }
}

Export.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired,
  history: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    translate()(Export)
  )
)
