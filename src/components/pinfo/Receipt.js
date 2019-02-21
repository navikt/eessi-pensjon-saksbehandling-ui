import React from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { bindActionCreators } from 'redux'
import saveAs from 'file-saver'

import * as Nav from '../ui/Nav'
import PsychoPanel from '../../components/ui/Psycho/PsychoPanel'
import PdfUtils from '../../components/ui/Export/PdfUtils'
import File from '../../components/ui/File/File'

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
  constructor () {
    super()
    this.state = {
      downloaded: false
    }
    this.generateReceiptRequest = this.generateReceiptRequest.bind(this)
    this.downloadReceiptRequest = this.downloadReceiptRequest.bind(this)
  }

  generateReceiptRequest () {
    const { actions } = this.props
    actions.generateReceipt()
  }

  downloadReceiptRequest () {
    const { receipt } = this.props
    var blob = new Blob([PdfUtils.base64toData(receipt.content.base64)], { type: receipt.type })
    saveAs(blob, receipt.name)
  }

  render () {
    const { t, isGeneratingReceipt, receipt } = this.props

    const onClick = receipt ? this.downloadReceiptRequest : this.generateReceiptRequest
    let buttonLabel = t('ui:getReceipt')
    if (isGeneratingReceipt) {
        buttonLabel = t('ui:generating')
    }
    if (receipt) {
        buttonLabel = t('ui:downloadReceipt')
    }

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
          onClick={onClick}>
          {buttonLabel}
        </Nav.Knapp>
      </div>
      {receipt ? <div className='text-center'>
        <File ui='simple' file={receipt} width={400} height={600} pageNumber={1} />
      </div> : null}
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Receipt)
)
