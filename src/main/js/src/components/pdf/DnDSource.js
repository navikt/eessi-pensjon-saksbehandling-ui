import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';

import PDFPageInDnD from './PDFPageInDnD';

import * as pdfActions from '../../actions/pdf';

const getListStyle = (pdfsize, isDraggingOver) => ({
    background: isDraggingOver ? 'honeydew' : 'whitesmoke',
    padding: 10,
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    minHeight: pdfsize * 1.3,
    boxShadow: 'inset 5px 5px 5px lightgrey'
});

const getItemStyle = (pdfsize, isDragging, draggableStyle) => ({
    border: isDragging ? '2px color red' : '1px solid lightgrey',
    margin: '0 5px 0 0',
    minWidth: pdfsize,
    backgroundColor: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle
})

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

class DnDSource extends Component {

    state = {
        isHovering : false
    }

    onHandleMouseEnter() {
        this.setState({isHovering : true});
    }

    onHandleMouseLeave() {
        this.setState({isHovering : false});
    }

    addAllPagesToTargetPdf(name, e) {

        const { pdf, recipe, dndTarget, actions } = this.props;

        e.preventDefault();
        e.stopPropagation();

        let potentialPages = [], newRecipe = _.clone(recipe);
        let modified = false;

        _.range(1, pdf.numPages + 1).map(pageNumber => {
            return potentialPages.push({ pageNumber : pageNumber, name : name });
        });

        if (!newRecipe[dndTarget]) {
            newRecipe[dndTarget] = [];
        }
        potentialPages.map(page => {
            if (! _.find(newRecipe[dndTarget], page)) {
                modified = true;
                return newRecipe[dndTarget].push(page);
            }
            return page;
        });

        if (modified) {
            actions.setRecipe(newRecipe);
        }
    }

    render () {

        const { t, pdf, pdfsize, recipe, dndTarget } = this.props;

        let selectedPages = [];

        if (recipe[dndTarget]) {
            selectedPages = _.filter(recipe[dndTarget], {name: pdf.name});
        }

        let addAllLink = this.state.isHovering ? <a href='#addAll' onClick={this.addAllPagesToTargetPdf.bind(this, pdf.name)}>{t('ui:addAll')}</a> : null;

        return <div className='div-dndsource position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>

            <div className='position-absolute' style={{top: 5, right: 5}}>{addAllLink}</div>

            <Droppable droppableId={'dndsource-' + pdf.name} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef} style={getListStyle(pdfsize, snapshot.isDraggingOver)}>

                        {_.range(1, pdf.numPages + 1).map(pageNumber => {
                            if (_.find(selectedPages, {pageNumber: pageNumber})) {
                                return null;
                            }
                            let key = pdf.name + '-' + pageNumber;
                            return  <Draggable key={key} draggableId={key} index={pageNumber}>

                                {(provided, snapshot) => (
                                    <div className='d-inline-block'
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            pdfsize,
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        <PDFPageInDnD pdf={pdf} pageNumber={pageNumber} action='add'/>
                                    </div>
                                )}
                            </Draggable>
                        })}
                    </div>
                )}
            </Droppable>
        </div>
    }
}

DnDSource.propTypes = {
    t       : PT.func.isRequired,
    recipe  : PT.array.isRequired,
    actions : PT.object,
    pdf     : PT.object.isRequired,
    pdfsize : PT.number,
    dndTarget : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DnDSource)
);
