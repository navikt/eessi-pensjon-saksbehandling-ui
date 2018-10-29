import html2pdf from 'html2pdf.js'
import _ from 'lodash'

var defaultOptions = {
  pagebreak: { mode: 'avoid-all', before: '.fieldset', after: '.fieldset' },
  margin: [40, 40, 40, 40],
  filename: 'kvittering.pdf',
  enableLinks: true,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: {
    orientation: 'portrait',
    unit: 'pt',
    format: 'A4'
  }
}

class PrintUtils {

  async printPreview (params) {
    let options = _.cloneDeep(defaultOptions)

    if (params.fileName) {
      options.filename = params.fileName
    }
    var element = document.getElementById(params.nodeId || 'divToPrint')

    if (options.includeAttachments) {
    }

    let pdf = await this.generate(options, element)

    return this.processRaw(pdf)
  }

  async print (params) {
    let options = _.cloneDeep(defaultOptions)

    if (params.fileName) {
      options.filename = params.fileName
    }
    var element = document.getElementById(params.nodeId || 'divToPrint')

    let pdf = await this.generate(options, element)
  }

  download(opt, element) {
      html2pdf().set(opt).from(element).save()
  }

  async generate (opt, element) {

    return new Promise(async (resolve) => {
        html2pdf().set(opt).from(element).outputPdf().then(pdf => {
            resolve(pdf)
        })
    });

  }

  processRaw(pdf) {

    let base64 = window.btoa(pdf)

    return {
        'base64' : base64,
        'data' : Uint8Array.from(pdf, c => c.charCodeAt(0))
    }
  }
}

const instance = new PrintUtils()
Object.freeze(instance)
export default instance
