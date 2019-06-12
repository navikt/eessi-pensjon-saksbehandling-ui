import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'

import File from 'components/ui/File/File'
import * as uiActions from 'actions/ui'
import * as storageActions from 'actions/storage'
import * as storages from 'constants/storages'

import './DnDExternalFiles.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    fileList: state.storage.fileList,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({...uiActions, ...storageActions}, dispatch) }
}

const DnDExternalFiles = (props) => {

  const { addFile, actions, username, fileList, file } = this.props

  const onaddFile = (file) => {
    if (typeof addFile === 'function') {
      addFile(file)
    }
  }

  const closePreview = () => {
    actions.closeModal()
  }

  const openPreview = (file) => {
    actions.openModal({
      modalContent: <div style={{ cursor: 'pointer' }} onClick={closePreview}>
        <File file={file} width={400} height={600} />
      </div>
    })
  }

  const onSelectFile = (file) => {
    actions.getStorageFile({
      userId: username,
      namespace: storages.FILES,
      file: file
    })
  }

  return <div className='c-pdf-dndExternalFiles'>
    {fileList ? <div className='fileList'>
      {fileList.map((_file, index) => {
        let selected = file && file.name === _file
        return <div className={classNames('fileRow', { selected: selected })} key={index}>
          <a className={classNames('fileName')} href='#select'
            onClick={() => onSelectFile(_file)}>{_file}</a>
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
                    onAddFile={() => onaddFile(file)}
                    onPreviewDocument={() => openPreview(file)} />
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

DnDExternalFiles.propTypes = {
  fileList: PT.array.isRequired,
  file: PT.object,
  addFile: PT.func,
  actions: PT.object.isRequired,
  username: PT.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DnDExternalFiles)
