import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import * as pdfActions from '../../actions/pdf';

const mapStateToProps = (state) => {
    return {
        pdfsize : state.pdf.pdfsize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class PDFSizeSlider extends Component {

    onChange(value) {

        const { actions } = this.props;
        actions.setPdfSize(value);
    }

    render () {

        const { t, pdfsize } = this.props;

        return <div className='c-pdf-PDFSizeSlider' title={t('pdf:help-sizeSliderTooltip')}>
            <Slider value={pdfsize} min={50} max={300} step={25} onChange={this.onChange.bind(this)}/>
        </div>
    }
}

PDFSizeSlider.propTypes = {

    t       : PT.func.isRequired,
    pdfsize : PT.number.isRequired,
    actions : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(PDFSizeSlider)
);

