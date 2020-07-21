import md5 from 'md5'

export default () => {
  const now = new Date().getTime()
  return {
    id: md5('' + now)
  }
}
