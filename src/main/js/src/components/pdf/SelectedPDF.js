import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';

import { Ikon } from '../ui/Nav';
import Icons from '../ui/Icons';

const styles = {
    selectedDocument: {
        border: 'solid 1px lightgray',
        padding: '5px',
        marginRight: '5px'
    }
}

class SelectedPDF extends Component {

    state = {
        isHovering : false,
        numPages: undefined
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    handleOnLoadSuccess(e) {

        const { onLoadSuccess } = this.props;

        this.setState({
            numPages : e.numPages
        }, () => {
            if (onLoadSuccess) {
                   onLoadSuccess(e);
               }
        });
    }

    render () {

        const { pdf, onLoadSuccess, onDeleteDocument } = this.props;

        let data = 'data:application/octet-stream;base64,' + encodeURIComponent(pdf.base64);
        let deleteLink = this.state.isHovering ? <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/> : null;
        let downloadLink = this.state.isHovering ? <a title='download' href={data} download={pdf.name}>
            <Icons size={20} kind='download'/>
        </a> : null;

        return <div className='d-inline-block' style={styles.selectedDocument}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='text-center position-relative' file={{data: pdf.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                <div className='position-absolute' style={{zIndex: 10, right: 5, top: 5}}> {deleteLink}</div>
                <div className='position-absolute' style={{zIndex: 10, left: 5, top: 5}}> {downloadLink}</div>
                <div><Page width='100' className='page' renderMode='svg' pageNumber={1}/></div>
                <div>File: {pdf.name}</div>
                <div>Pages: {this.state.numPages || 0}</div>
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
