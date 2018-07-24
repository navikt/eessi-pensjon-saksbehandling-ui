import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import PDFPageInDnD from './PDFPageInDnD';

import * as pdfActions from '../../actions/pdf';

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'honeydew' : 'whitesmoke',
    padding: 10,
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    boxShadow: 'inset 5px 5px 5px lightgrey'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    border: isDragging ? '2px color red' : '1px solid lightgrey',
    padding: 5,
    boxShadow: '5px 5px 5px lightgrey',
    margin: '0 5px 0 0',
    backgroundColor: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle
})

const mapStateToProps = (state) => {
    return {
        recipe : state.pdf.recipe,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class DnDSource extends Component {

    addAllPagesToTargetPdf(fileName, e) {

        const { pdf, recipe, actions } = this.props;

        e.preventDefault();

        let potentialPages = [], newRecipe = recipe.slice();
        _.range(1, pdf.numPages + 1).map(pageNumber => {
            return potentialPages.push({ pageNumber : pageNumber, fileName : fileName });
        });
        potentialPages.map(page => {
            if (! _.find(recipe, page)) {
                return newRecipe.push(page);
            }
            return;
        });
        actions.setRecipe(newRecipe);
    }

    render () {

        const { pdf, recipe } = this.props;

        let selectedPages = _.filter(recipe, {fileName: pdf.fileName});

        return <div>
            <div>File: {pdf.fileName}</div>
            <div><a href='#' onClick={this.addAllPagesToTargetPdf.bind(this, pdf.fileName)}>add all</a></div>

            <Droppable droppableId={'dndsource-' + pdf.fileName} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>

                        {_.range(1, pdf.numPages + 1).map(pageNumber => {
                            if (_.find(selectedPages, {pageNumber: pageNumber})) {
                                return null;
                            }
                            let key = pdf.fileName + '-' + pageNumber;
                            return  <Draggable key={key} draggableId={key} index={pageNumber}>

                                {(provided, snapshot) => (
                                    <div className='d-inline-block'
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
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
    recipe: PT.array.isRequired,
    actions: PT.object,
    pdf: PT.object.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDSource);
