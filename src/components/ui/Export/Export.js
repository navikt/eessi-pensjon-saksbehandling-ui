import React, { Component } from 'react'
import PT from 'prop-types'

import PdfUtils from './PdfUtils'
import * as Nav from '../../ui/Nav'

class Export extends Component {
  onPdfRequest (fileName, nodeId) {
    PdfUtils.downloadPdf({
      fileName: fileName,
      element: nodeId
    })
  }

  render () {
    const { fileName, nodeId, buttonLabel } = this.props

    return <Nav.Knapp onClick={this.onPdfRequest.bind(this, fileName, nodeId)}>{buttonLabel}</Nav.Knapp>
  }
}

Export.propTypes = {
  fileName: PT.string,
  nodeId: PT.string,
  buttonLabel: PT.string.isRequired
}

export default Export
