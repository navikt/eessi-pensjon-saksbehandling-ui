import react, { useState } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import Dropzone from 'react-dropzone'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import joarkActions from 'actions/joark'

import './JoarkBrowser.css'

const mapStateToProps = (state) => {
  return {
    list: state.joark.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(joarkActions, dispatch)}
}

const JoarkBrowser = (props) => {

  const { list } = props
  const [ files, setFiles ] = useState([])

  const onDragEnd = () => {
  }

  const onDrop = () => {
  }

  const onDropRejected = () => {
  }

  return <div className='c-ui-joarkBrowser'>
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='c-ui-joarkBrowser__draggable-div'>
        {list ? list.map((file, index) => {
          return <Draggable
            key={index}
            draggableId={'c-ui-joarkBrowser__draggable-item-' +key}
            index={index}>
            {(provided, snapshot) => (
              <div className={classNames('c-ui-joarkBrowser__draggable', { dragging: snapshot.isDragging })}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                <File file={file} addLink animate previewLink downloadLink
                  width={141.4} height={200} scale={1.0}
                  onAddFile={() => .addFile(file)}
                  onPreviewDocument={this.openPreview.bind(this, file)} />
              </div>
            )}
          </Draggable>
        }) : null}
      </div>
      <Droppable droppableId={'joark-browser'} direction='horizontal'>
        {(provided, snapshot) => (
          <div className={classNames('dropzone', 'p-4', className)}>
            <Dropzone
              length={files.length}
              activeClassName='dropzone-active'
              accept={acceptedMimetypes}
              onDrop={onDrop}
              onDropRejected={onDropRejected}
              inputProps={{ ...props.inputProps }}
              {...tabIndex}>
              {({ getRootProps, getInputProps }) => <div
                {...getRootProps()}
                ref={provided.innerRef}
                className={classNames('droppable-zone', { 'droppable-zone-active ': snapshot.isDraggingOver })}>
                <input {...getInputProps()} />
                <div className='dropzone-placeholder'>
                  <div className='dropzone-placeholder-message'>{t('ui:dropFilesHere', { maxFiles: maxFiles })}</div>
                  <div className={classNames('dropzone-placeholder-status', 'dropzone-placeholder-status-' + status.type)}>{status.message}</div>
                </div>
                {provided.placeholder}
                <div className='dropzone-files scrollable'>
                  { files ? files.map((file, i) => {
                    return <File className='mr-2' key={i} file={file}
                      currentPage={currentPages[i]}
                      deleteLink downloadLink previewLink
                      onPreviousPage={this.onPreviousPageRequest.bind(this, i)}
                      onNextPage={this.onNextPageRequest.bind(this, i)}
                      onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                      onDeleteDocument={this.removeFile.bind(this, i)}
                      onPreviewDocument={this.openPreview.bind(this, file)}
                    />
                  }) : null }
                </div>
              </div>}
            </Dropzone>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>
}

export default connect(mapStateToProps, dispatchStateToProps)(JoarkBrowser)
