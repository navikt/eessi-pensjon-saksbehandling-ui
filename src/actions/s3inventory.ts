import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call } from 'js-fetch-api'
import mockS3file from 'mocks/s3/file'
import mockS3list from 'mocks/s3/list'
import { ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const getS3list: ActionCreator<ActionWithPayload<undefined>> = (
): ActionWithPayload<undefined> => {
  return call({
    url: urls.S3INVENTORY_LIST_URL,
    expectedPayload: mockS3list,
    method: 'GET',
    type: {
      request: types.S3INVENTORY_LIST_REQUEST,
      success: types.S3INVENTORY_LIST_SUCCESS,
      failure: types.S3INVENTORY_LIST_FAILURE
    }
  })
}

export const getS3file: ActionCreator<ActionWithPayload<undefined>> = (
  filename: string
): ActionWithPayload<undefined> => {
  return call({
    url: sprintf(urls.S3INVENTORY_FILE_URL, {filename}),
    expectedPayload: mockS3file(filename),
    method: 'GET',
    context: {
      filename
    },
    type: {
      request: types.S3INVENTORY_FILE_REQUEST,
      success: types.S3INVENTORY_FILE_SUCCESS,
      failure: types.S3INVENTORY_FILE_FAILURE
    }
  })
}

export const resetS3FilesJob = () => ({
  type: types.S3INVENTORY_JOB_RESET
})

export const setS3FilesJob = (
  s3filesJob: Array<any>
) => ({
  type: types.S3INVENTORY_JOB_SET,
  payload: s3filesJob
})
