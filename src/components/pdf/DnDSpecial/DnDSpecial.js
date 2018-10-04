import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import PDFSpecialPage from '../PDFSpecialPage/PDFSpecialPage';
import * as Nav from '../../ui/Nav';

import * as pdfActions from '../../../actions/pdf';

import './DnDSpecial.css';

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
        pdfsize: state.pdf.pdfsize,
        dndTarget : state.pdf.dndTarget
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class DnDSpecial extends Component {

    state = {
        isHovering : false,
        title: ''
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    setSpecialPageTitle(e) {
        this.setState({
            title : e.target.value
        })
    }

    render () {

        const { t } = this.props;

        return <div className='c-pdf-dndSpecial position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>

            <Droppable isDropDisabled={true} droppableId={'c-pdf-dndSpecial-droppable'} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef}
                        className={classNames('c-pdf-dndSpecial-droppable', {'c-pdf-dndSpecial-droppable-active' : snapshot.isDraggingOver})}>

                        <Draggable key={'dndspecial'} draggableId={encodeURIComponent(this.state.title)} index={0}>

                            {(provided, snapshot) => (
                                <div className={classNames('c-pdf-dndSpecial-draggable', { dragging : snapshot.isDragging })}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <PDFSpecialPage title={this.state.title} deleteLink={false}
                                        className={classNames({'c-pdf-dndSpecial-draggable-active' : snapshot.isDragging})}/>
                                </div>
                            )}
                        </Draggable>
                        <div>
                            <Nav.Input label={t('ui:title')} defaultValue={this.state.title} onChange={this.setSpecialPageTitle.bind(this)}/>
                        </div>
                    </div>
                )}
            </Droppable>
        </div>
    }
}

DnDSpecial.propTypes = {
    t         : PT.func.isRequired,
    recipe    : PT.object.isRequired,
    actions   : PT.object,
    pdf       : PT.object.isRequired,
    pdfsize   : PT.number,
    dndTarget : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DnDSpecial)
);
