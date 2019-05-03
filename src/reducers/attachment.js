import * as types from '../constants/actionTypes'

export const initialAttachmentState = {}

const attachmentReducer = (state = initialAttachmentState, action = {}) => {
  switch (action.type) {
    case types.ATTACHMENT_ADD_FILE_TO_STATE:
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.file
      })

    case types.ATTACHMENT_REMOVE_FILE_FROM_STATE: {
      let newState = Object.assign({}, state)
      delete newState[action.payload]
      return newState
    }

    case types.ATTACHMENT_REMOVE_FILE_ARRAY_FROM_STATE: {
      let newState = Object.assign({}, state)
      action.payload.forEach(md5 => {
        delete newState[md5]
      })
      return newState
    }

    case types.STORAGE_GET_ATTACHMENT_SUCCESS:
      return Object.assign({}, state, action.payload)

    case types.ATTACHMENT_CLEAR_STATE:
      return initialAttachmentState

    default:
      return state
  }
}

export default attachmentReducer
