import React from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { bindActionCreators } from 'redux'
import saveAs from 'file-saver'

import * as Nav from '../ui/Nav'
import PsychoPanel from '../../components/ui/Psycho/PsychoPanel'
import PdfUtils from '../../components/ui/Export/PdfUtils'

import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    receipt: state.pinfo.receipt,
    isGeneratingReceipt: state.loading.isGeneratingReceipt
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Receipt extends React.Component {
  state = {
    downloaded: false
  }

  componentDidUpdate () {
    const { receipt } = this.props
    const { downloaded } = this.state
    if (receipt && !downloaded) {
      this.setState({
        downloaded: true
      })
      this.onDownloadRequest()
    }
  }

  generateReceiptRequest () {
    const { actions, receipt } = this.props
    const { downloaded } = this.state

    if (downloaded && receipt) {
      this.onDownloadRequest()
    } else {
      actions.generateReceipt()
    }
  }

  onDownloadRequest () {
    const { receipt } = this.props
    var blob = new Blob([PdfUtils.base64toData(receipt.content.base64)], { type: receipt.type })
    saveAs(blob, receipt.name)
  }

  render () {
    const { t, isGeneratingReceipt, receipt } = this.props
    const { isReady } = this.state

    return <div className='c-pinfo-receipt'>
      <PsychoPanel closeButton>
        <p>{t('pinfo:receipt-veileder')}</p>
      </PsychoPanel>
      <div className='text-center'>
        <Nav.Knapp
        id='pinfo-receipt-generate-button'
            className='generateButton m-4'
            disabled={isGeneratingReceipt}
            spinner={isGeneratingReceipt}
            onClick={this.generateReceiptRequest.bind(this)}>
            {isGeneratingReceipt ? t('ui:generating') : t('ui:getReceipt')}
        </Nav.Knapp>
      </div>
      {receipt ? <embed style={{ width: '100%', height: '100vh' }}
        type='application/pdf'
        src={'data:application/pdf;base64,' + encodeURIComponent(receipt.content.base64)} /> : null}
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Receipt)
)
