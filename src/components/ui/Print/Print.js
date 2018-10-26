import React, { Component } from 'react'
import PT from 'prop-types'

import PrintUtils from './PrintUtils'
import * as Nav from '../../ui/Nav'

class Print extends Component {
  onPdfRequest (fileName, nodeId) {
    const { useCanvas } = this.props

    PrintUtils.print({
      fileName: fileName,
      nodeId: nodeId,
      useCanvas: useCanvas || false
    })
  }

  render () {
    const { fileName, nodeId, buttonLabel } = this.props

    return <Nav.Knapp onClick={this.onPdfRequest.bind(this, fileName, nodeId)}>{buttonLabel}</Nav.Knapp>
  }
}

Print.propTypes = {
  fileName: PT.string,
  nodeId: PT.string,
  useCanvas: PT.bool,
  buttonLabel: PT.string.isRequired
}

export default Print
