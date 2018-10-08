import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
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
        watermarkEnabled : false,
        watermarkTitle : '',
        title: ''
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    setSpecialPageTitle(e) {

        if (e.target) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({
            title : e.target ? e.target.value : e
        })
    }

    setWatermarkTitle (e) {

        const { actions } = this.props;

        this.setState({
            watermarkTitle: e.target.value
        }, () => {
            actions.setWatermark({
                title : this.state.watermarkTitle
            });
        })
    }

    render () {

        const { t } = this.props;

        let separatorEnabled = this.state.title ? true : false;

        return <div className='c-pdf-dndSpecial position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>

            <Droppable isDropDisabled={true} droppableId={'c-pdf-dndSpecial-droppable'} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef}
                        className={classNames('c-pdf-dndSpecial-droppable', {'c-pdf-dndSpecial-droppable-active' : snapshot.isDraggingOver})}>

                        <Draggable key={'dndspecial'} draggableId={encodeURIComponent(this.state.title)} index={0} isDragDisabled={!separatorEnabled}>

                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div className={classNames('c-pdf-dndSpecial-draggable', { dragging : snapshot.isDragging })}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <PDFSpecialPage title={this.state.title} deleteLink={false}
                                            className={classNames({
                                                'enabled' : separatorEnabled,
                                                'disabled' : !separatorEnabled,
                                                'c-pdf-dndSpecial-draggable-active' : snapshot.isDragging
                                            })}/>
                                    </div>
                                    {snapshot.isDragging && (
                                        <div className='cloneStyle'>
                                            <PDFSpecialPage title={this.state.title} deleteLink={false}/>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>

                        <div className='ml-3'>

                        </div>
                        <div className='ml-3'>
                            <Nav.Textarea maxLength={100} className='d-inline-block' placeholder={t('ui:text')} value={this.state.title} onChange={this.setSpecialPageTitle.bind(this)}/>

                        </div>
                        <div className='ml-3'>
                            <Nav.Textarea maxLength={100} className='d-inline-block' placeholder={t('ui:watermark')} value={this.state.watermarkTitle} onChange={this.setWatermarkTitle.bind(this)}/>
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
