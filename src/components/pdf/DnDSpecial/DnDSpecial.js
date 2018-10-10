import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';


import PDFSpecialPage from '../PDFSpecialPage/PDFSpecialPage';
import * as Nav from '../../ui/Nav';
import ColorPicker from '../../ui/ColorPicker';

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
        watermarkText : '',
        watermarkTextColor : {
            r : 255, g: 0, b: 0, a: 0.25
        },
        separatorText: '',
        separatorTextColor: {
            r: 0, g: 0, b: 0, a: 1
        }
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    setSeparatorText(e) {

        if (e.target) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({
            separatorText : e.target ? e.target.value : e
        });
    }
    setSeparatorTextColor(color) {

        this.setState({
            separatorTextColor : color.rgb
        });
    }

    setWatermarkText (e) {

        const { actions } = this.props;

        this.setState({
            watermarkText: e.target.value
        }, () => {
            actions.setWatermark({
                watermarkText : this.state.watermarkText,
                watermarkTextColor : this.state.watermarkTextColor
            });
        })
    }

    setWatermarkTextColor (color) {

        const { actions } = this.props;

        this.setState({
            watermarkTextColor: color.rgb
        }, () => {
            actions.setWatermark({
                watermarkText : this.state.watermarkText,
                watermarkTextColor : this.state.watermarkTextColor
            });
        })
    }

    render () {

        const { t } = this.props;

        let separatorEnabled = this.state.separatorText ? true : false;

        return <div className='c-pdf-dndSpecial position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>

            <Droppable isDropDisabled={true} droppableId={'c-pdf-dndSpecial-droppable'} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef}
                        className={classNames('c-pdf-dndSpecial-droppable', {'c-pdf-dndSpecial-droppable-active' : snapshot.isDraggingOver})}>

                        <Draggable key={'dndspecial'} draggableId={encodeURIComponent(
                            JSON.stringify({'separatorText': this.state.separatorText, 'separatorTextColor' : this.state.separatorTextColor})
                        )} index={0} isDragDisabled={!separatorEnabled}>

                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div className={classNames('c-pdf-dndSpecial-draggable', { dragging : snapshot.isDragging })}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <PDFSpecialPage separatorTextColor={this.state.separatorTextColor} separatorText={this.state.separatorText} deleteLink={false}
                                            className={classNames({
                                                'enabled' : separatorEnabled,
                                                'disabled' : !separatorEnabled,
                                                'c-pdf-dndSpecial-draggable-active' : snapshot.isDragging
                                            })}/>
                                    </div>
                                    {snapshot.isDragging && (
                                        <div className='cloneStyle'>
                                            <PDFSpecialPage separatorTextColor={this.state.separatorTextColor} separatorText={this.state.separatorText} deleteLink={false}/>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>

                        <div className='ml-3'>

                        </div>
                        <div className='ml-3'>
                            <Nav.Textarea maxLength={100} className='d-inline-block' placeholder={t('ui:text')} value={this.state.separatorText} onChange={this.setSeparatorText.bind(this)}/>
                            <ColorPicker color={ this.state.separatorTextColor } onChangeComplete={ this.setSeparatorTextColor.bind(this) }/>
                        </div>
                        <div className='ml-3'>
                            <Nav.Textarea maxLength={100} className='d-inline-block' placeholder={t('ui:watermark')} value={this.state.watermarkText} onChange={this.setWatermarkText.bind(this)}/>
                            <ColorPicker color={ this.state.watermarkTextColor } onChangeComplete={ this.setWatermarkTextColor.bind(this) } />
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
