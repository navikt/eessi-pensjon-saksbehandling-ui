import React, { Component } from 'react';
import PT from 'prop-types';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Ikon } from '../Nav';
import Icons from '../Icons';

import './File.css';
import './MiniaturePDF.css';

class MiniaturePDF extends Component {

    state = {
        currentPage: 1
    }

    static getDerivedStateFromProps(props, state) {

        if (props.currentPage !== undefined &&
            !isNaN(props.currentPage) &&
            props.currentPage !== state.currentPage) {

            return {
                currentPage: props.currentPage
            }
        }
        return {};
    }

    componentDidUpdate() {

        let { currentPage } = this.props;

        if (this.state.currentPage === undefined) {
            this.setState({
                currentPage: !isNaN(currentPage) ? currentPage : 1
            });
        }
    }

    componentDidMount() {

        let { currentPage } = this.props;

        this.setState({
            isHovering : false,
            numPages: undefined,
            currentPage: !isNaN(currentPage) ? currentPage : 1
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
            if (typeof onLoadSuccess === 'function') {
                onLoadSuccess(e);
            }
        });
    }

    onDeleteDocument(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onDeleteDocument } = this.props;

        this.setState({
            currentPage: 1
        }, () => {
             if (typeof onDeleteDocument === 'function') {
                onDeleteDocument();
             }
        });
    }

    onPreviewDocument(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onPreviewDocument } = this.props;

        if (typeof onPreviewDocument === 'function') {
            onPreviewDocument();
        }
    }

    onAddFile(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onAddFile } = this.props;

        if (typeof onAddFile === 'function') {
            onAddFile();
        }
    }

    handlePreviousPageRequest(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onPreviousPage } = this.props;

        if (onPreviousPage && typeof onPreviousPage === 'function') {
            onPreviousPage();
        } else {
            this.setState({
                currentPage : this.state.currentPage - 1
            });
        }
    }

    handleNextPageRequest(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onNextPage } = this.props;

        if (onNextPage && typeof onNextPage === 'function') {
            onNextPage();
        } else {
            this.setState({
                currentPage : this.state.currentPage + 1
            });
        }
    }

    render () {

        const { t, file, size, addLink, deleteLink, downloadLink, previewLink, className, animate, scale, width, height } = this.props;
        const { numPages, isHovering, currentPage } = this.state;

        const title = '' + file.name + '\n' + t('ui:pages') + ': ' + (numPages || '0') + '\n' + t('ui:size') + ': ' + size;

        return <div title={title} className={classNames('c-ui-file', 'c-ui-miniaturePdf', className, {'animate' : animate})}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}
            style={{transform: 'scale(' + scale + ')'}}>
            <Document className='position-relative' file={{data: file.content.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                {previewLink && isHovering ? <div  onClick={this.onPreviewDocument.bind(this)} className='link previewLink'>
                    <Icons style={{cursor: 'pointer'}} size='1x' kind='view'/>
                </div> : null}
                { deleteLink && isHovering ? <div onClick={this.onDeleteDocument.bind(this)} className='link deleteLink'>
                    <Ikon size={15} kind='trashcan'/>
                </div> : null}
                { addLink && isHovering ? <div onClick={this.onAddFile.bind(this)} className='link addLink'>
                    <Ikon size={20} kind='vedlegg'/>
                </div> : null}
                { downloadLink && isHovering ? <div className='link downloadLink'><a
                    onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
                    download={file.name}>
                    <Icons size={'sm'} kind='download'/>
                </a></div> : null}
                {currentPage > 1 && isHovering ? <a href='#previousPage' className='previousPage' onClick={this.handlePreviousPageRequest.bind(this)}>{'◀'}</a> : null}
                {currentPage < numPages && isHovering ? <a href='#nextPage' className='nextPage'  onClick={this.handleNextPageRequest.bind(this)}>{'▶'}</a> : null}
                {isHovering ? <div className='pageNumber'>{currentPage}</div> : null}
                <div className='page' onClick={(e) => e.stopPropagation()}>
                    <Page width={width || 100} height={height || 140} renderMode='svg' pageNumber={currentPage}/>
                </div>
            </Document>
        </div>
    }
}

MiniaturePDF.propTypes = {
    t                : PT.func.isRequired,
    onLoadSuccess    : PT.func,
    file             : PT.object.isRequired,
    size             : PT.string,
    width            : PT.number,
    height           : PT.number,
    animate          : PT.bool,
    onDeleteDocument : PT.func,
    onPreviewDocument: PT.func,
    onAddFile        : PT.func,
    deleteLink       : PT.bool,
    downloadLink     : PT.bool,
    addLink          : PT.bool,
    previewLink      : PT.bool,
    className        : PT.string,
    currentPage      : PT.number,
    onPreviousPage   : PT.func,
    onNextPage       : PT.func,
    scale            : PT.number.isRequired
}

export default translate()(MiniaturePDF);
