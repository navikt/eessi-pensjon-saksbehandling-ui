import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { translate } from 'react-i18next';
import classNames from 'classnames';

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

        const { t, file, onDeleteDocument, deleteLink, downloadLink, className } = this.props;

        return <div className={classNames('miniaturePdf', className)}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='position-relative' file={{data: file.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                { deleteLink && this.state.isHovering ? <div className='deleteLink'>
                    <Ikon size={20} kind='trashcan' onClick={onDeleteDocument}/>
                </div> : null}
                { downloadLink && this.state.isHovering ? <div className='downloadLink'><a
                    onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(file.base64)}
                    download={file.name}>
                    <Icons size={'sm'} kind='download'/>
                </a></div> : null}
                <div className='page'>
                    <Page width={100} height={140} renderMode='svg' pageNumber={1}/>
                </div>
                <div className='fileName'> {file.name}</div>
                <div className='numPages'>{t('ui:pages')}{': '}{this.state.numPages || '0'}</div>
                <div className='fileSize'>{t('ui:size')}{': '}{file.size}{' '}{t('ui:bytes')}</div>
            </Document>
        </div>
    }
}

MiniaturePDF.propTypes = {
    t                : PT.func.isRequired,
    onLoadSuccess    : PT.func,
    file             : PT.object.isRequired,
    onDeleteDocument : PT.func,
    deleteLink       : PT.bool,
    downloadLink     : PT.bool,
    className        : PT.string
}

export default translate()(MiniaturePDF);
