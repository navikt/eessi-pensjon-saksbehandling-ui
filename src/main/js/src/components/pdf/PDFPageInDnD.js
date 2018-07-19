import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import _ from 'lodash';

import * as pdfActions from '../../actions/pdf';

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class PDFPageInDnD extends Component {

    state = {}

    addPageToTargetPdf(fileName, pageNumber) {

        let { recipe, actions } = this.props;

        this.cancelTimeout();
        let newRecipe = recipe.slice();
        newRecipe.push({fileName: fileName, pageNumber: pageNumber});
        actions.setRecipe(newRecipe);
    }

    removePageFromTargetPdf(fileName, pageNumber) {

        const { recipe, actions } = this.props;
        let newRecipe = recipe.slice();
        let index = _.findIndex(recipe, {fileName: fileName, pageNumber : pageNumber});
        if (index >= 0) {
            newRecipe.splice(index, 1);
            actions.setRecipe(newRecipe);
        }
    }

    onMouseEnter(fileName, pageNumber) {

        const { actions } = this.props;

        let timeout = this.state.timeout;
        if (!timeout) {
            let newTimeout = setTimeout(function() {
                actions.previewPDF({
                    fileName: fileName,
                    pageNumber : pageNumber
                });
            }, 2000);
            this.setState({timeout : newTimeout})
        }
    }

    cancelTimeout() {

        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
            this.setState({timeout: undefined});
        }
    }

    onMouseLeave(fileName, pageNumber) {
        this.cancelTimeout();
    }

    render () {

        const { pdf, pageNumber, action } = this.props;

        let clickFunction;
        if (action === 'add') {
            clickFunction = this.addPageToTargetPdf;
        } else {
            clickFunction = this.removePageFromTargetPdf
        }

        return <Document className='document d-inline-block' file={{data: pdf.data}}>
            <Page onMouseEnter={this.onMouseEnter.bind(this, pdf.fileName, pageNumber)}
                onMouseLeave={this.onMouseLeave.bind(this, pdf.fileName, pageNumber)}
                onClick={clickFunction.bind(this, pdf.fileName, pageNumber)}
                className='d-inline-block page' width='100' renderMode='svg' pageNumber={pageNumber}/>
        </Document>
    }
}

PDFPageInDnD.propTypes = {
    recipe: PT.array.isRequired,
    actions: PT.object,
    pdfs: PT.array.isRequired,
    fileName: PT.string.isRequired,
    pageNumber: PT.number.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFPageInDnD);
