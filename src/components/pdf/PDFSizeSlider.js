import React, { Component } from 'react'
import PT from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import * as pdfActions from '../../actions/pdf'

const mapStateToProps = (state) => {
  return {
    pageScale: state.pdf.pageScale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pdfActions), dispatch) }
}

class PDFSizeSlider extends Component {
  onChange (value) {
    const { actions } = this.props
    actions.setPdfSize(value)
  }

  render () {
    const { t, pageScale, style } = this.props

    return <div style={style} className='c-pdf-PDFSizeSlider' title={t('pdf:help-sizeSliderTooltip')}>
      <Slider value={pageScale} min={0.5} max={2.5} step={0.1} onChange={this.onChange.bind(this)} />
    </div>
  }
}

PDFSizeSlider.propTypes = {

  t: PT.func.isRequired,
  pageScale: PT.number.isRequired,
  actions: PT.object,
  style: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(PDFSizeSlider)
)
