import PostalCodesData from './Postal-codes-Norway-ansi'

class PostalCodes {
  private values: {[k: string]: string}
  constructor () {
    this.values = {}
    PostalCodesData.split('\n').forEach(line => {
      const v = line.split(';')
      if (v[0]) {
        this.values[v[0]] = v[1]
      }
    })
  }

  get (val: string) {
    return this.values[val]
  }
}

const postalCodes: PostalCodes = new PostalCodes()
Object.freeze(postalCodes)
export default postalCodes
