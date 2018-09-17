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
            if (onLoadSuccess) {
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
            onDeleteDocument();
        });
    }


    handlePreviousPageRequest(e) {

        e.stopPropagation();
        e.preventDefault();

        const { onPreviousPage } = this.props;

        if (onPreviousPage) {
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

        if (onNextPage) {
            onNextPage();
        } else {
            this.setState({
                currentPage : this.state.currentPage + 1
            });
        }
    }

    render () {

        const { t, file, size, deleteLink, downloadLink, className } = this.props;
        const { numPages, isHovering, currentPage } = this.state;

        return <div className={classNames('miniaturePdf', className)}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            <Document className='position-relative' file={{data: file.data }}
                onLoadSuccess={this.handleOnLoadSuccess.bind(this)}>
                { deleteLink && isHovering ? <div className='deleteLink'>
                    <Ikon size={20} kind='trashcan' onClick={this.onDeleteDocument.bind(this)}/>
                </div> : null}
                { downloadLink && isHovering ? <div className='downloadLink'><a
                    onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(file.base64)}
                    download={file.name}>
                    <Icons size={'sm'} kind='download'/>
                </a></div> : null}
                {currentPage > 1 && isHovering ? <Icons size={'2x'} className='previousPage' kind='caretLeft' onClick={this.handlePreviousPageRequest.bind(this)}/> : null}
                {currentPage < numPages && isHovering ? <Icons size={'2x'} className='nextPage' kind='caretRight' onClick={this.handleNextPageRequest.bind(this)}/> : null}
                {isHovering ? <div className='pageNumber'>{currentPage}</div> : null}
                <div className='page' onClick={(e) => e.stopPropagation()}>
                    <Page width={100} height={140} renderMode='svg' pageNumber={currentPage}/>
                </div>
                <div className='fileName'> {file.name}</div>
                <div className='numPages'>{t('ui:pages')}{': '}{numPages || '0'}</div>
                <div className='fileSize'>{t('ui:size')}{': '}{size}</div>
            </Document>
        </div>
    }
}

MiniaturePDF.propTypes = {
    t                : PT.func.isRequired,
    onLoadSuccess    : PT.func,
    file             : PT.object.isRequired,
    size             : PT.string,
    onDeleteDocument : PT.func,
    deleteLink       : PT.bool,
    downloadLink     : PT.bool,
    className        : PT.string,
    currentPage      : PT.number.isRequired,
    onPreviousPage   : PT.func,
    onNextPage       : PT.func
}

export default translate()(MiniaturePDF);
