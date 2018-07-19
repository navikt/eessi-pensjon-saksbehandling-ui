import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import PT from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from '../ui/Nav';

import * as pdfActions from '../../actions/pdf';

const mapStateToProps = (state) => {
    return {
        preview : state.pdf.preview,
        pdfs    : state.pdf.pdfs
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class PreviewPDF extends Component {

    closeModal () {

        const { actions } = this.props;
        actions.cancelPreviewPDF();
    }

    render () {

        const { preview, pdfs } = this.props;

        if (!preview || !pdfs) {
            return null;
        }

        let pdf = _.find(pdfs, {fileName: preview.fileName});

        return <Nav.Modal isOpen={true}
            onRequestClose={this.closeModal.bind(this)}
            contentLabel='contentLabel'>
            <Document className='document' file={{data: pdf.data }}>
                <Page className='page' width='600' renderMode='svg' pageNumber={preview.pageNumber}/>
            </Document>
        </Nav.Modal>
    }
}

PreviewPDF.propTypes = {
    recipe: PT.array.isRequired,
    actions: PT.object,
    pdfs: PT.array,
    preview: PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewPDF);
