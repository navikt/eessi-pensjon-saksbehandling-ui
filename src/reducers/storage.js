import * as types from 'constants/actionTypes'
import _ from 'lodash'

export const initialStorageState = {
  modalOpen: false,
  fileList: undefined,
  file: undefined
}

const storageReducer = (state = initialStorageState, action = {}) => {
  let parsedList
  switch (action.type) {
    case types.STORAGE_LIST_SUCCESS:
      parsedList = action.payload.map(file => {
        const index = file.lastIndexOf('___')
        return index >= 0 ? file.substring(index + 3) : file
      })

      return {
        ...state,
        fileList: parsedList
      }

    case types.STORAGE_LIST_FAILURE:
      return {
        ...state,
        fileList: []
      }

    case types.STORAGE_GET_SUCCESS:
      return {
        ...state,
        file: action.payload
      }

    case types.STORAGE_POST_SUCCESS:
      // clean fileList so that component requests a list again
      return {
        ...state,
        fileList: undefined
      }

    case types.STORAGE_TARGET_FILE_TO_DELETE_SET : {
      return {
        ...state,
        fileToDelete: action.payload
      }
    }

    case types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL : {
      return {
        ...state,
        fileToDelete: undefined
      }
    }

    case types.STORAGE_DELETE_SUCCESS: {
      const _fileList = _.clone(state.fileList)
      const fileIndex = _fileList.indexOf(state.fileToDelete)

      if (fileIndex >= 0) {
        _fileList.splice(fileIndex, 1)
      }

      return {
        ...state,
        fileList: _fileList,
        fileToDelete: undefined
      }
    }

    case types.STORAGE_MODAL_OPEN:

      return {
        ...state,
        modalOpen: true,
        modalOptions: action.payload
      }

    case types.STORAGE_MODAL_CLOSE:
    case types.APP_CLEAR_DATA:

      return initialStorageState

    default:

      return state
  }
}

export default storageReducer
