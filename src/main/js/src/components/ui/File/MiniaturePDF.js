import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { translate } from 'react-i18next';

import { Ikon } from '../Nav';
import Icons from '../Icons';

import './MiniaturePDF.css';

class MiniaturePDF extends Component {

    state = {}

    componentDidMount() {
        this.setState({
            isHovering : false,
            numPages: undefined
        });
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

        const { t, pdf, onDeleteDocument, deleteLink, downloadLink } = this.props;

        return <div className='miniaturePdf'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='position-relative' file={{data: pdf.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                { deleteLink && this.state.isHovering ? <div className='deleteLink'>
                    <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/>
                </div> : null}
                { downloadLink && this.state.isHovering ? <div className='downloadLink'><a
                    onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(pdf.base64)}
                    download={pdf.name}>
                    <Icons size={'sm'} kind='download'/>
                </a></div> : null}
                <div className='page'>
                    <Page width={100} height={140} renderMode='svg' pageNumber={1}/>
                </div>
                <div className='fileName'> {pdf.name}</div>
                <div className='numPages'>{t('ui:pages')}{': '}{this.state.numPages || '0'}</div>
                <div className='numPages'>{t('ui:size')}{': '}{pdf.size}{' '}{t('ui:bytes')}</div>
            </Document>
        </div>
    }
}

MiniaturePDF.propTypes = {
    t                : PT.func.isRequired,
    onLoadSuccess    : PT.func,
    pdf              : PT.object.isRequired,
    onDeleteDocument : PT.func,
    deleteLink       : PT.bool,
    downloadLink     : PT.bool
}

export default translate()(MiniaturePDF);
