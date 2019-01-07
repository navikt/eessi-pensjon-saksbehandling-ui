import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PT from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import File from '../../ui/File/File'
import * as uiActions from '../../../actions/ui'
import * as storageActions from '../../../actions/storage'
import * as storages from '../../../constants/storages'

import './DnDExternalFiles.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    fileList: state.storage.fileList,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, storageActions), dispatch) }
}

class DnDExternalFiles extends Component {
  addFile (file) {
    const { addFile } = this.props

    if (typeof addFile === 'function') {
      addFile(file)
    }
  }

  closePreview () {
    const { actions } = this.props

    actions.closeModal()
  }

  openPreview (file) {
    const { actions } = this.props

    actions.openModal({
      modalContent: <div style={{ cursor: 'pointer' }} onClick={this.closePreview.bind(this)}>
        <File file={file} width={400} height={600} />
      </div>
    })
  }

  onSelectFile (file) {
    const { actions, username } = this.props

    actions.getStorageFile({
      userId: username,
      namespace: storages.FILES,
      file: file
    })
  }

  render () {
    const { fileList, file } = this.props

    return <div className='c-pdf-dndExternalFiles'>
      {fileList ? <div className='fileList'>
        {fileList.map((_file, index) => {
          let selected = file && file.name === _file
          return <div className={classNames('fileRow', { selected: selected })} key={index}>
            <a className={classNames('fileName')} href='#select'
              onClick={this.onSelectFile.bind(this, _file)}>{_file}</a>
          </div>
        })}
      </div> : null}
      {file ? <Droppable isDropDisabled droppableId={'c-pdf-dndExternalFiles-droppable'} direction='horizontal'>
        {(provided) => (
          <div className='m-2' ref={provided.innerRef}>
            <Draggable className='draggable' draggableId={'storageFile'} index={0}>
              {(provided, snapshot) => (
                <React.Fragment>
                  <div ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={classNames({ 'dragging': snapshot.isDragging })}>
                    <File file={file} addLink animate previewLink downloadLink
                      width={141.4} height={200} scale={1.0}
                      onAddFile={this.addFile.bind(this, file)}
                      onPreviewDocument={this.openPreview.bind(this, file)} />
                  </div>
                  {snapshot.isDragging && (
                    <div className='cloneStyle'>
                      <File file={file} addLink={false} animate={false}
                        width={141.4} height={200} scale={1.0} />
                    </div>
                  )}
                </React.Fragment>
              )}
            </Draggable>
          </div>
        )}
      </Droppable> : null}
    </div>
  }
}

DnDExternalFiles.propTypes = {
  fileList: PT.array.isRequired,
  file: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DnDExternalFiles)
