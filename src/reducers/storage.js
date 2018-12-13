/* global Uint8Array */

import * as types from '../constants/actionTypes'
import _ from 'lodash'

let initialState = {
  modalOpen: false,
  fileList: undefined,
  file: undefined
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.STORAGE_LIST_SUCCESS: {
      let parsedList = action.payload.map(file => {
        let index = file.lastIndexOf('___')
        return index >= 0 ? file.substring(index + 3) : file
      })

      return Object.assign({}, state, {
        fileList: parsedList
      })
    }

    case types.STORAGE_LIST_FAILURE: {
      return Object.assign({}, state, {
         fileList: []
      })
    }

    case types.STORAGE_GET_SUCCESS: {
      return Object.assign({}, state, {
        file: action.payload,
        fileName: action.fileName
      })
    }

    case types.STORAGE_POST_SUCCESS: {
      // clean fileList so that component requests a list again
      return Object.assign({}, state, {
        fileList: undefined
      })
    }

    case types.STORAGE_TARGET_FILE_TO_DELETE_SET : {
      return Object.assign({}, state, {
        fileToDelete: action.payload
      })
    }

    case types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL : {
      return Object.assign({}, state, {
        fileToDelete: undefined
      })
    }

    case types.STORAGE_DELETE_SUCCESS: {
      let _fileList = _.clone(state.fileList)
      let fileIndex = _fileList.indexOf(state.fileToDelete)

      if (fileIndex >= 0) {
        _fileList.splice(fileIndex, 1)
      }

      return Object.assign({}, state, {
        fileList: _fileList,
        fileToDelete: undefined
      })
    }

    case types.STORAGE_MODAL_OPEN:

      return Object.assign({}, state, {
        modalOpen: true,
        modalOptions: action.payload
      })

    case types.STORAGE_MODAL_CLOSE:
    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
