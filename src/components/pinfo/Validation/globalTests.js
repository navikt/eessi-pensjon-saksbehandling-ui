import _ from 'lodash'

export function isPInfoEmpty (pinfo) {
  let person = _.cloneDeep(pinfo.person)
  delete person.idAbroad
  return _.isEmpty(person) &&
    _.isEmpty(pinfo.bank) &&
    _.isEmpty(pinfo.stayAbroad)
}
