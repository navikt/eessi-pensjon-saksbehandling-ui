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
        extPdfs    : state.pdf.extPdfs,
        droppables : state.app.droppables
    }
};

const mapDispatchToProps = () => {
    return {};
};

class TopContainer extends Component {

    onDragEnd(e) {

        const { droppables, extPdfs } = this.props;
        let sourcePdf;

        if (e.source && e.source.droppableId === 'dnd-external-files') {
            sourcePdf = extPdfs[e.source.index];
        }

        if (sourcePdf && e.destination) {
            let droppableRef = droppables[e.destination.droppableId];
            droppableRef.getWrappedInstance().addFile(sourcePdf);
        }
    }

    render () {

        const { className, style, history, sideContent } = this.props;

        return <div style={style} className={classNames('topcontainer', className)}>
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                <Drawer sideContent={sideContent}>
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
    children    : PT.node.isRequired,
    className   : PT.string,
    style       : PT.object,
    droppables  : PT.object,
    extPdfs     : PT.array,
    sideContent : PT.object.isRequired,
    history     : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopContainer);
