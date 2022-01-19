import * as types from 'constants/actionTypes'
import { GetS3FilesJob } from 'declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface S3InventoryState {
  s3list: Array<any> | null | undefined
  s3files: {[k in string]: any}
  getS3FilesJob: GetS3FilesJob | undefined
}

export const initialS3InventoryState: S3InventoryState = {
  s3list: undefined,
  s3files: {},
  getS3FilesJob: undefined
}

const s3inventoryReducer = (state: S3InventoryState = initialS3InventoryState, action: Action | ActionWithPayload = { type: '' }) => {
  switch (action.type) {
    case types.S3INVENTORY_LIST_REQUEST:
      return {
        ...state,
        s3list: undefined
      }

    case types.S3INVENTORY_LIST_FAILURE:
      return {
        ...state,
        s3list: null
      }

    case types.S3INVENTORY_LIST_SUCCESS:
      return {
        ...state,
        s3list: (action as ActionWithPayload).payload
      }

    case types.S3INVENTORY_FILE_REQUEST: {
      const filename = (action as ActionWithPayload).context.filename
      return {
        ...state,
        getS3FilesJob: {
          ...state.getS3FilesJob,
          loading: filename
        }
      }
    }

    case types.S3INVENTORY_FILE_FAILURE: {
      let newS3files = _.cloneDeep(state.s3files)
      newS3files[(action as ActionWithPayload).context.filename] = null
      return {
        ...state,
        s3files: newS3files
      }
    }

    case types.S3INVENTORY_FILE_SUCCESS: {
      let newS3files = _.cloneDeep(state.s3files)
      const filename = (action as ActionWithPayload).context.filename
      newS3files[filename] = (action as ActionWithPayload).payload

      const newRemaining = _.reject(state.getS3FilesJob!.remaining, (item: string) => item === filename)
      const newLoaded = state.getS3FilesJob?.loaded.concat(filename)

      return {
        ...state,
        s3files: newS3files,
        getS3FilesJob: {
          ...state.getS3FilesJob,
          loading: undefined,
          loaded: newLoaded,
          remaining: newRemaining
        }
      }
    }

    case types.S3INVENTORY_JOB_RESET:
      return {
        ...state,
        getS3FilesJob: undefined
      }

    case types.S3INVENTORY_JOB_SET : {
      const files = _.cloneDeep((action as ActionWithPayload).payload)
      return {
        ...state,
        getS3FilesJob: {
          total: files,
          remaining: files,
          loaded: [],
          notloaded: [],
          loading: undefined
        }
      }
    }

    default:
      return state
  }
}

export default s3inventoryReducer
