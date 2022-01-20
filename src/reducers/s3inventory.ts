import * as types from 'constants/actionTypes'
import { BucInfo, Comment } from 'declarations/buc'
import { GetS3FilesJob } from 'declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface S3InventoryState {
  s3list: Array<any> | null | undefined
  getS3FilesJob: GetS3FilesJob | undefined
  s3stats: {
    type?: {[k in string]: number}
    comments?: {[k in string]: number}
    tags?: {[k in string]: number}
  }
}

export const initialS3InventoryState: S3InventoryState = {
  s3list: undefined,
  getS3FilesJob: undefined,
  s3stats: {}
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

    case types.S3INVENTORY_FILE_FAILURE:
      return state

    case types.S3INVENTORY_FILE_SUCCESS: {
      const filename = (action as ActionWithPayload).context.filename
      const payload = (action as ActionWithPayload).payload

      const newRemaining = _.reject(state.getS3FilesJob!.remaining, (item: string) => item === filename)
      const newLoaded = state.getS3FilesJob?.loaded.concat(filename)

      const newS3stats = _.cloneDeep(state.s3stats)
      const match = filename.match(/^([^_]+)___([^_]+)(.+)?$/)
      if (!_.isEmpty(match)) {
        const type: string = match[2]
        if (!newS3stats.type) {
          newS3stats.type = {}
        }
        newS3stats.type[type] = !Object.prototype.hasOwnProperty.call(newS3stats.type, type)
          ? 1
          : newS3stats.type[type]++

        if (type === 'BUC') {
          if (payload.bucs) {
            Object.values(payload.bucs as Array<BucInfo>).forEach((buc: BucInfo) => {
              if (!_.isEmpty(buc.comment)) {
                if (!newS3stats.comments) {
                  newS3stats.comments = {}
                }
                if (_.isString(buc.comment)) {
                  newS3stats.comments[buc.comment!] = !Object.prototype.hasOwnProperty.call(newS3stats.comments, buc.comment)
                    ? 1
                    : newS3stats.comments[buc.comment]++
                }
                if (_.isArray(buc.comment)) {
                  buc.comment.forEach((c: Comment) => {
                    if (c.value) {
                      newS3stats.comments![c.value] = !Object.prototype.hasOwnProperty.call(newS3stats.comments, c.value)
                        ? 1
                        : newS3stats.comments![c.value]++
                    }
                  })
                }
                if (_.isArray(buc.tags)) {
                  buc.tags.forEach((t) => {
                    newS3stats.tags![t] = !Object.prototype.hasOwnProperty.call(newS3stats.tags, t)
                     ? 1
                     : newS3stats.tags![t]++
                  })
                }
              }
            })
          }
        }
      }

      return {
        ...state,
        s3stats: newS3stats,
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
