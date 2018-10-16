import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import PageInDnD from '../PageInDnD/PageInDnD';

import * as pdfActions from '../../../actions/pdf';

import './DnDSource.css';

const mapStateToProps = (state) => {
    return {
        recipe    : state.pdf.recipe,
        pageScale : state.pdf.pageScale,
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
            return potentialPages.push({ pageNumber : pageNumber, name : name, type: 'pickPage' });
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

        const { t, pdf, pageScale, recipe, dndTarget } = this.props;

        let selectedPages = [];

        if (recipe[dndTarget]) {
            selectedPages = _.filter(recipe[dndTarget], {name: pdf.name});
        }

        let addAllLink = this.state.isHovering ? <a href='#addAll' onClick={this.addAllPagesToTargetPdf.bind(this, pdf.name)}>{t('ui:addAll')}</a> : null;

        return <div className='c-pdf-dndSource position-relative'
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>

            <Droppable isDropDisabled={true} droppableId={'c-pdf-dndSource-droppable-' + pdf.name} direction='horizontal'>

                {(provided, snapshot) => (

                    <div ref={provided.innerRef}
                        className={classNames('c-pdf-dndSource-droppable', {'c-pdf-dndSource-droppable-active' : snapshot.isDraggingOver})}
                        style={{minHeight: pageScale * 140}}>

                        {_.range(1, pdf.numPages + 1).map(pageNumber => {
                            if (_.find(selectedPages, {pageNumber: pageNumber})) {
                                return null;
                            }
                            let key = pdf.name + '-' + pageNumber;
                            return  <Draggable key={key} draggableId={key} index={pageNumber}>

                                {(provided, snapshot) => (
                                    <div className={classNames('c-pdf-dndSource-draggable', { dragging : snapshot.isDragging })}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <PageInDnD
                                            className={classNames({'c-pdf-dndSource-draggable-active' : snapshot.isDragging})}
                                            style={{
                                                minWidth: 100 * pageScale,
                                                minHeight: 140 * pageScale
                                            }}
                                            file={pdf}
                                            pageNumber={pageNumber}
                                            action='add'/>
                                    </div>
                                )}
                            </Draggable>
                        })}
                    </div>
                )}
            </Droppable>
            <div className='addAllLink'>{addAllLink}</div>
        </div>
    }
}

DnDSource.propTypes = {
    t         : PT.func.isRequired,
    recipe    : PT.object.isRequired,
    actions   : PT.object,
    pdf       : PT.object.isRequired,
    pageScale : PT.number,
    dndTarget : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DnDSource)
);
