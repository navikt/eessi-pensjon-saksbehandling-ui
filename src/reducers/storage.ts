import * as types from 'constants/actionTypes'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import { Action } from 'redux'

export interface StorageState {
  modal: ModalContent | undefined;
  fileToDelete: any;
  fileList: Array<string> | undefined;
  file: any;
}

export const initialStorageState: StorageState = {
  modal: undefined,
  fileToDelete: undefined,
  fileList: undefined,
  file: undefined
}

const storageReducer = (state: StorageState = initialStorageState, action: Action | ActionWithPayload) => {
  switch (action.type) {
    case types.STORAGE_LIST_SUCCESS:
      return {
        ...state,
        fileList: (action as ActionWithPayload).payload.map((file: string) => {
          const index = file.lastIndexOf('___')
          return index >= 0 ? file.substring(index + 3) : file
        })
      }

    case types.STORAGE_LIST_FAILURE:
      return {
        ...state,
        fileList: []
      }

    case types.STORAGE_GET_SUCCESS:
      return {
        ...state,
        file: (action as ActionWithPayload).payload
      }

    case types.STORAGE_POST_SUCCESS:
      // clean fileList so that component requests a list again (fileList == undefined triggers a fetch)
      return {
        ...state,
        fileList: undefined
      }

    case types.STORAGE_TARGET_FILE_TO_DELETE_SET:
      return {
        ...state,
        fileToDelete: (action as ActionWithPayload).payload
      }

    case types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL:
      return {
        ...state,
        fileToDelete: undefined
      }

    case types.STORAGE_DELETE_SUCCESS: {
      return {
        ...state,
        fileList: _.reject(state.fileList, (it) => _(it).isEqual(state.fileToDelete)),
        fileToDelete: undefined
      }
    }

    case types.APP_CLEAR_DATA:

      return initialStorageState

    default:

      return state
  }
}

export default storageReducer
