import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PT from 'prop-types';
import _ from 'lodash';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';

import File from '../../ui/File/File';
import './DnDExternalFiles.css';
import * as pdfActions from '../../../actions/pdf';

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class DnDExternalFiles extends Component {

    state = {
        files: []
    };

    static getDerivedStateFromProps(newProps) {

        return {
            files : newProps.extPdfs
        }
    }

    addDocument(pdf) {

        const { addDocument } = this.props;

        if (typeof addDocument === 'function') {
            addDocument(pdf);
        }
    }

    onLoadSuccess(index, event) {

        const { actions } = this.props;

        if (index !== undefined && event && event.numPages) {

            let newFiles = _.clone(this.state.files);
            newFiles[index].numPages = event.numPages;

            actions.setExternalFileList(newFiles);
        }
    }

    render () {

        const { files } = this.state;

        if (!files) {
            return null;
        }

        return <div className='c-pdf-dndExternalFiles'>
            <Droppable isDropDisabled={true} droppableId={'c-pdf-dndExternalFiles-droppable'} direction='horizontal'>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        {files.map((pdf, index) => {
                            return <Draggable className='draggable' key={index} draggableId={index} index={index}>
                                {(provided, snapshot) => (
                                    <React.Fragment>
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                            <File key={index} file={pdf} addLink={true}
                                                onAddDocument={this.addDocument.bind(this, pdf)}
                                                onLoadSuccess={this.onLoadSuccess.bind(this, index)}/>
                                        </div>
                                        {snapshot.isDragging && (
                                            <div className='cloneStyle'>
                                                <File animate={false} key={index} file={pdf}/>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                            </Draggable>
                        })}
                    </div>
                )}
            </Droppable>
        </div>
    }
}

DnDExternalFiles.propTypes = {
    extPdfs : PT.array.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DnDExternalFiles);
