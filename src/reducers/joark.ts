import * as types from 'constants/actionTypes'
import { JoarkFileWithContent, JoarkPoster } from 'declarations/joark'
import { ActionWithPayload } from 'js-fetch-api'

export interface JoarkState {
  list: Array<JoarkPoster> | undefined
  previewFile: JoarkFileWithContent | undefined
}

export const initialJoarkState: JoarkState = {
  list: undefined,
  previewFile: undefined
}

const joarkReducer = (state: JoarkState = initialJoarkState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.JOARK_LIST_SUCCESS:
    return {
      ...state,
      list: action.payload.data.dokumentoversiktBruker.journalposter
    }

    case types.JOARK_PREVIEW_SET:
      return {
        ...state,
        previewFile: action.payload
      }

    case types.JOARK_PREVIEW_SUCCESS:
      return {
        ...state,
        previewFile: {
          ...action.context,
          name: action.payload.fileName,
          size: action.payload.filInnhold.length,
          mimetype: action.payload.contentType,
          content: {
            base64: action.payload.filInnhold
          }
        } as JoarkFileWithContent
      }

    default:
      return state
  }
}

export default joarkReducer
