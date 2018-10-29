import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import SummaryRender from './SummaryRender'
import Icons from '../../../ui/Icons'

import * as Nav from '../../../ui/Nav'
import PrintUtils from '../../../ui/Print/PrintUtils'

import * as p4000Actions from '../../../../actions/p4000'

import './Print.css'
import '../Menu.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch) }
}

class Print extends Component {
  state = {
    blackAndWhite: false,
    renderingPreview : false,
    tab: 'panel-1'
  }

  onBackButtonClick () {
    const { actions } = this.props

    actions.setPage('new')
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  async onPrintPreviewRequest () {
    const { includeAttachments } = this.state
    this.setState({
        renderingPreview : true
    })

    let previewPdf = await PrintUtils.printPreview({
      nodeId: 'divToPrint',
      useCanvas: true,
      includeAttachments: includeAttachments
    })
    this.setState({
        renderingPreview : false,
        previewPdf : previewPdf
    })
  }

  async onPrintRequest () {
    const { includeAttachments } = this.state

    await PrintUtils.print({
      nodeId: 'divToPrint',
      useCanvas: true,
      includeAttachments: includeAttachments
    })
  }

  setCheckbox (key, e) {
    this.setState({
      [key]: e.target.checked
    })
  }

  onTabChange (e) {
      this.setState({
        tab: e.currentTarget.id
      })
    }

  render () {
    const { t, events } = this.props
    const { blackAndWhite, previewPdf, renderingPreview } = this.state

    return <Nav.Panel className='c-p4000-menu c-p4000-menu-print p-0 mb-4'>
      <div className='title m-4'>
        <Nav.Knapp className='backButton mr-4' onClick={this.onBackButtonClick.bind(this)}>
          <Icons className='mr-2' kind='back' size='1x' />{t('ui:back')}
        </Nav.Knapp>
        <Icons size='3x' kind={'print'} className='float-left mr-4' />
        <h1 className='m-0'>{t('p4000:file-print')}</h1>
      </div>
      <div className='row'>

        <div className='col-md-3'>
          <div style={{marginTop: '6rem'}}>
            <Nav.Checkbox label={t('includeAttachments')} onChange={this.setCheckbox.bind(this, 'includeAttachments')} />
            <Nav.Checkbox label={t('blackAndWhite')} onChange={this.setCheckbox.bind(this, 'blackAndWhite')} />

            <Nav.Knapp className='printButton' onClick={this.onPrintRequest.bind(this)}>
                <Icons className='mr-2' kind='print' size='1x' />
                {t('print')}
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
              <SummaryRender t={t} events={events}
                animate={false}
                previewAttachments={false}
                blackAndWhite={blackAndWhite}
              />
            </div>
          </div>
          <div className={classNames('panel', { 'hidden': this.state.tab !== 'panel-2' })} role='tabpanel' id='panel-2'>
            <Nav.Knapp style={{minHeight: '50px'}}
              className='printPreviewButton'
              onClick={this.onPrintPreviewRequest.bind(this)}
              disabled={renderingPreview}
              spinner={renderingPreview}>
               <Icons className='mr-2' kind='print' size='1x' />
               {renderingPreview ? t('renderingPreview') : t('printPreview')}
            </Nav.Knapp>

            { previewPdf ? <embed style={{width: '100%', height: '70vh'}}
              type='application/pdf'
              src={'data:application/pdf;base64,' + encodeURIComponent(previewPdf.base64)} />  : null}
          </div>
        </div>
      </div>
    </Nav.Panel>
  }
}

Print.propTypes = {
  t: PT.func,
  events: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Print)
)
