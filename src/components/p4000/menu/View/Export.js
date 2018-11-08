/* global Blob */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import print from 'print-js'
import { withRouter } from 'react-router'
import _ from 'lodash'

import SummaryRender from './SummaryRender'
import Icons from '../../../ui/Icons'

import * as Nav from '../../../ui/Nav'
import PdfUtils from '../../../ui/Export/PdfUtils'

import * as routes from '../../../../constants/routes'
import * as uiActions from '../../../../actions/ui'
import * as p4000Actions from '../../../../actions/p4000'
import * as pdfActions from '../../../../actions/pdf'
import * as storageActions from '../../../../actions/storage'

import './Export.css'
import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    comment: state.p4000.comment,
    username: state.app.username,
    pdf: state.p4000.pdf
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions, uiActions, p4000Actions, storageActions), dispatch) }
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
    tab: 'panel-content'
  }

  componentDidMount () {
    const { events, history, actions } = this.props
    if (_.isEmpty(events)) {
      history.replace(routes.P4000)
      return
    }

    actions.addToBreadcrumbs([{
      url: routes.P4000,
      label: 'p4000:app'
    }, {
      url: routes.P4000 + '/export',
      label: 'p4000:file-export'
    }])

    window.scrollTo(0, 0)
  }

  onBackButtonClick () {
    const { history } = this.props
    history.goBack()
  }

  async generatePdf () {
    const { events, actions } = this.props
    const { includeAttachments } = this.state

    let pdf = await PdfUtils.createPdf({
      nodeId: 'divToPrint',
      includeAttachments: includeAttachments,
      events: events
    })
    actions.setPdf(pdf)
    this.setState({
      needToGeneratePDF: false
    })
    return pdf
  }

  async onPdfPreviewRequest () {
    this.setTab('panel-pdf')

    this.setState({
      doingPreview: true
    })
    try {
      console.log('Generating a PDF for preview')
      await this.generatePdf()
    } catch (e) {
      console.log('Failure to generate PDF', e)
    }
    this.setState({
      doingPreview: false
    })
  }

  async onDownloadRequest () {
    const { pdf } = this.props
    const { needToGeneratePDF } = this.state

    this.setTab('panel-pdf')

    if (needToGeneratePDF === false && pdf) {
      console.log('Skipping generating PDF, reusing pdf')
      this.downloadLink.setAttribute('href',
        'data:application/octet-stream;base64,' + encodeURIComponent(pdf.content.base64)
      )
      this.downloadLink.click()
    } else {
      console.log('Generating PDF, pdf is old')

      this.setState({
        doingDownload: true
      })

      try {
        let newPdf = await this.generatePdf()
        this.downloadLink.setAttribute('href',
          'data:application/octet-stream;base64,' + encodeURIComponent(newPdf.content.base64)
        )
        this.downloadLink.click()
      } catch (e) {
        console.log('Failure to generate PDF', e)
      }
      this.setState({
        doingDownload: false
      })
    }
  }

  async onPrintRequest () {
    const { pdf } = this.props
    const { needToGeneratePDF } = this.state

    this.setTab('panel-pdf')

    if (needToGeneratePDF === false && pdf) {
      console.log('Skipping generating PDF, reusing pdf')

      const pdfBlob = new Blob([
        PdfUtils.base64toData(pdf.content.base64)
      ], { type: 'application/pdf' })
      const url = URL.createObjectURL(pdfBlob)
      print(url)
    } else {
      this.setState({
        doingPrint: true
      })

      console.log('Generating PDF, pdf is old')
      try {
        let newPdf = await this.generatePdf()
        const pdfBlob = new Blob([
          PdfUtils.base64toData(newPdf.content.base64)
        ], { type: 'application/pdf' })
        const url = URL.createObjectURL(pdfBlob)
        print(url)
      } catch (e) {
        console.log('Failure to generate PDF', e)
      }
      this.setState({
        doingPrint: false
      })
    }
  }

  onAdvancedEditRequest () {
    const { history, actions, pdf } = this.props

    actions.selectPDF([pdf])
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

  setTab (id) {
    this.setState({
      tab: id
    })
  }

  onSaveRequest (e) {
    const { actions, pdf } = this.props

    actions.openStorageModal({
      action: 'save',
      blob: pdf,
      mimetype: 'application/pdf',
      name: pdf.name
    })
  }

  render () {
    const { t, events, comment, username, pdf } = this.props
    const { tab, includeAttachments, blackAndWhite, doingPreview, doingPrint, doingDownload } = this.state

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
              href='#download'
              download={'p4000.pdf'}>{t('ui:download')}</a>

            <Nav.Knapp
              className='exportButton previewButton'
              onClick={this.onPdfPreviewRequest.bind(this)}
              disabled={doingPreview}
              spinner={doingPreview}>
              <Icons kind='view' size='2x' />
              {doingPreview ? t('renderingPreview') : t('pdfPreview')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton downloadButton'
              onClick={this.onDownloadRequest.bind(this)}
              disabled={doingDownload}
              spinner={doingDownload}>
              <Icons kind='download' size='2x' />
              {doingDownload ? t('renderingPdf') : t('download')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton printButton'
              onClick={this.onPrintRequest.bind(this)}
              disabled={doingPrint}
              spinner={doingPrint}>
              <Icons kind='print' size='2x' />
              {doingPrint ? t('renderingPdf') : t('print')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton saveButton'
              disabled={pdf === undefined}
              onClick={this.onSaveRequest.bind(this)}>
              <Icons kind='save' size='2x' />
              {t('saveToServer')}
            </Nav.Knapp>

            <Nav.Knapp className='exportButton advancedEditButton'
              onClick={this.onAdvancedEditRequest.bind(this)}
              disabled={pdf === undefined}>
              <Icons kind='tool' size='2x' />
              {t('advancedEdit')}
            </Nav.Knapp>
          </div>
        </div>
        <div className='col-md-9'>
          <Nav.TabsPure defaultAktiv={_.indexOf(['panel-content', 'panel-pdf'], tab)} onChange={this.onTabChange.bind(this)}>
            <Nav.TabsPure.Tab id='panel-content' aktiv={tab === 'panel-content'}>{t('content')}</Nav.TabsPure.Tab>
            <Nav.TabsPure.Tab id='panel-pdf' aktiv={tab === 'panel-pdf'}>{t('preview')}</Nav.TabsPure.Tab>
          </Nav.TabsPure>
          <div className={classNames('panel', { 'hidden': tab !== 'panel-content' })} role='tabpanel' id='panel-content'>
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
          <div className={classNames('panel', { 'hidden': tab !== 'panel-pdf' })} role='tabpanel' id='panel-pdf'>

            { (doingPreview || doingDownload || doingPrint)
              ? <div className='w-100 text-center'>
                <Nav.NavFrontendSpinner />
                <p>{t('generating')}</p>
              </div>
              : pdf
                ? <embed style={{ width: '100%', height: '70vh' }}
                  type='application/pdf'
                  src={'data:application/pdf;base64,' + encodeURIComponent(pdf.content.base64)} />
                : null
            }
          </div>
        </div>
      </div>
    </Nav.Panel>
  }q
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
