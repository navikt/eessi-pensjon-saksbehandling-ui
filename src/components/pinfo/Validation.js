import pinfoValidationTests from './pinfoValidationTests'
import _ from 'lodash'
let tests = pinfoValidationTests

export default (form, step) => (
  tests[step].map(t => ({ key: t.key, error: t.validationTest(form[t.key]) }))
    .filter(res => typeof (res.error) === 'string')
    .reduce((acc, cur) => _.merge(acc, { [cur.key]: [cur.error] }), {})
)
