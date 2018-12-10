import _ from 'lodash'

export function isPInfoEmpty (pinfo) {
  return _.isEmpty(pinfo.person) && _.isEmpty(pinfo.bank) && _.isEmpty(pinfo.stayAbroad)
}
