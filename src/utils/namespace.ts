import _ from 'lodash'

export const getIdx = (index: any | undefined): string => (
  !_.isNil(index) && ((_.isNumber(index) && index >= 0) || (_.isString(index) && !_.isEmpty(index)))
    ? '[' + index + ']'
    : ''
)
