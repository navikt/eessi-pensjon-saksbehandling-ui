
export const renderDate = (date, t) => {
  if (!date) {
    return t('ui:unknown')
  }
  const mm = date.getMonth() + 1 // getMonth() is zero-based
  const dd = date.getDate()
  return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('.')
}

export const pinfoDateToDate = (date) => {
  if (!date || !date.year || !date.month) { return null }
  const day = date.day || 1
  const month = parseInt(date.month, 10) - 1
  const year = date.year
  return { year, month, day }
}
