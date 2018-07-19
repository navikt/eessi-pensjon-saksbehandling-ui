import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';

import { Ikon } from '../ui/Nav';

class SelectedPDF extends Component {

    state = {
        isHovering : false
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    render () {

        const { pdf, onLoadSuccess, pageNumbers, onDeleteDocument } = this.props;

        let deleteLink = this.state.isHovering ? <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/> : null;

        return <div className='d-inline-block'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='text-center position-relative selectedDocument' file={{data: pdf.data }} onLoadSuccess={onLoadSuccess}>
                <div className='position-absolute' style={{zIndex: 10, right: 5, top: 5}}> {deleteLink}</div>
                <div><Page width='100' className='page' renderMode='svg' pageNumber={1}/></div>
                <div>File: {pdf.fileName}</div>
                <div>Pages: {pageNumbers || 0}</div>
            </Document>
        </div>
    }
}

SelectedPDF.propTypes = {
    onLoadSuccess: PT.func.isRequired,
    pdf: PT.object.isRequired,
    onDeleteDocument: PT.func.isRequired,
    pageNumbers: PT.number.isRequired
}

export default SelectedPDF;
