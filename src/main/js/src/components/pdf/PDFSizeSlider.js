import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Slider, { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';

import * as settingsActions from '../../actions/settings';

const mapStateToProps = (state) => {
    return {
        pdfsize : state.settings.pdfsize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, settingsActions), dispatch)};
};

class PDFSizeSlider extends Component {

    onChange(value) {

        const { actions } = this.props;
        actions.setPdfSize(value);
    }

    render () {

        const { pdfsize } = this.props;

        return <div>
            <Slider value={pdfsize} min={50} max={300} step={25} onChange={this.onChange.bind(this)}/>
        </div>
    }
}

PDFSizeSlider.propTypes = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFSizeSlider);

