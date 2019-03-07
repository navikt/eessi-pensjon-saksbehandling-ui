
export function renderDate (date, t) {
  if (!date) {
    return t('ui:unknown')
  }
  let mm = date.getMonth() + 1 // getMonth() is zero-based
  let dd = date.getDate()
  return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('.')
}

export function pinfoDateToDate (date) {
  if (!date || !date.year || !date.month) { return null }
  let day = date.day || 1
  let month = parseInt(date.month, 10) - 1
  let year = date.year
  return { year, month, day }
}
