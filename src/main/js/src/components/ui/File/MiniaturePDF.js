import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { translate } from 'react-i18next';

import { Ikon } from '../Nav';
import Icons from '../Icons';

import './MiniaturePDF.css';

class MiniaturePDF extends Component {

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

        const { t, pdf, onDeleteDocument } = this.props;

        let data = 'data:application/octet-stream;base64,' + encodeURIComponent(pdf.base64);
        let deleteLink = this.state.isHovering ? <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/> : null;
        let downloadLink = this.state.isHovering ? <a title={t('ui:download')} href={data} download={pdf.name}>
            <Icons size={20} kind='download'/>
        </a> : null;

        return <div className='miniaturePdf'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='position-relative' file={{data: pdf.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                <div className='deleteLink'> {deleteLink}</div>
                <div className='downloadLink'> {downloadLink}</div>
                <div className='page'>
                    <Page width='100' renderMode='svg' pageNumber={1}/>
                </div>
                <div className='fileName'> {pdf.name}</div>
                <div className='numPages'>{t('ui:pages')}: {this.state.numPages || 0}</div>
                <div className='numPages'>{t('ui:size')}: {pdf.size} {t('ui:bytes')}</div>
            </Document>
        </div>
    }
}

MiniaturePDF.propTypes = {
    t                : PT.func.isRequired,
    onLoadSuccess    : PT.func.isRequired,
    pdf              : PT.object.isRequired,
    onDeleteDocument : PT.func.isRequired,
    pageNumbers      : PT.number.isRequired
}

export default translate()(MiniaturePDF);
