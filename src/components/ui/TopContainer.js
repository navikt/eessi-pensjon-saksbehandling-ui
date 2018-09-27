import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import * as Nav from './Nav';
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Drawer from './Drawer/Drawer';
import Modal from './Modal';

import { DragDropContext } from 'react-beautiful-dnd';
import ExternalFiles from '../pdf/ExternalFiles/ExternalFiles';

const mapStateToProps = (state) => {
    return {
        extPdfs  : state.pdf.extPdfs
    }
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

class TopContainer extends Component {

    onDragEnd(e) {

        let sourcePdf;

        if (e.source && e.source.droppableId === 'dndfiles') {

            sourcePdf = this.props.extPdfs[e.source.index];
        }

        if (e.destination && e.destination.droppableId === 'fileUploadDroppable') {

            this.props.fileUpload.getWrappedInstance().addFile(sourcePdf);
        }
        return;
    }

    render () {

        const { className, style, history } = this.props;

        return <div style={style} className={classNames('topcontainer', className)}>
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <Drawer sidebar={<ExternalFiles/>}>
                <TopHeader/>
                <ServerAlert/>
                <Modal/>
                <Breadcrumbs history={history}/>
                <Nav.Container fluid={true}>
                    {this.props.children}
                </Nav.Container>
            </Drawer>
            </DragDropContext>
        </div>
    }
}

TopContainer.propTypes = {
    children  : PT.node.isRequired,
    className : PT.string,
    style     : PT.object,
    onDragEnd : PT.func,
    history   : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopContainer);
