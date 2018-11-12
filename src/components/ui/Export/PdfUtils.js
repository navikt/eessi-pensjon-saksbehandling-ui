import html2pdf from 'html2pdf.js'
import _ from 'lodash'
import request from 'request'
import PDFJS from 'pdfjs-dist'

import * as urls from '../../../constants/urls'

var defaultOptions = {
  pagebreak: { mode: 'avoid-all' },
  margin: [50, 50, 50, 50],
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

class PdfUtils {
  async createPdf (params) {
    let options = _.cloneDeep(defaultOptions)

    if (params.fileName) {
      options.filename = params.fileName
    }

    let pdf = await this.generate({

      options: options,
      element: document.getElementById(params.nodeId || 'divToPrint'),
      events: params.events,
      includeAttachments: params.includeAttachments
    })
    return pdf
  }

  downloadPdf (params) {
    let options = _.cloneDeep(defaultOptions)
    if (params.fileName) {
      options.filename = params.fileName
    }
    html2pdf().set(options).from(params.element).save()
  }

  async generate (params) {
    return new Promise(async (resolve, reject) => {
      html2pdf().set(params.options).from(params.element).outputPdf().then(rawPdf => {
        this.processRaw(rawPdf).then(processedPdf => {
          if (!params.includeAttachments) {
            resolve(processedPdf)
          } else {
            let body = {
              watermark: {},
              files: [processedPdf],
              recipe: {
                'p4000': [{
                  type: 'pickDocument',
                  name: processedPdf.name
                }]
              }
            }

            params.events.map((event, index) => {
              if (event.files) {
                event.files.map((file, index2) => {
                  let _file = _.cloneDeep(file)
                  let newFileName
                  let action

                  switch (_file.mimetype) {

                    case 'application/pdf' :
                      newFileName = 'P4000-' + index + '-' + index2 + '.pdf'
                      action = 'pickDocument'
                      break
                    case 'image/jpeg':
                    case 'image/jpg':
                      newFileName = 'P4000-' + index + '-' + index2 + '.jpg'
                      action = 'pickImage'
                      break
                    case 'image/png':
                      newFileName = 'P4000-' + index + '-' + index2 + '.png'
                      action = 'pickImage'
                      break
                    default:
                      break
                  }

                  if (action) {
                    _file.name = newFileName
                    body.files.push(_file)
                    body.recipe.p4000.push({
                      type: action,
                      name: newFileName
                    })
                  }

                  return file
                })
              }
              return event
            })

            try {
              request({
                url: urls.PDF_GENERATE_URL,
                method: 'POST',
                crossOrigin: true,
                json: true,
                body: body
              }, function (error, response, body) {
                if (error || !response || response.statusCode >= 400) {
                  reject(error)
                } else {
                  let p4000 = body.p4000
                  resolve(p4000)
                }
              })
            } catch (e) {
              reject(e)
            }
          }
        })
      })
    })
  }

  base64toData (base64) {
    return Uint8Array.from(window.atob(base64), c => c.charCodeAt(0))
  }

  processRaw (pdf) {
    let base64 = window.btoa(pdf)
    let data = Uint8Array.from(pdf, c => c.charCodeAt(0))

    return new Promise(resolve => {
      PDFJS.getDocument(data).then(doc => {
        resolve({
          'numPages': doc.numPages,
          'name': 'P4000.pdf',
          'size': pdf.length,
          'mimetype': 'application/pdf',
          'content': {
            'base64': base64
          }
        })
      })
    })
  }
}

const instance = new PdfUtils()
Object.freeze(instance)
export default instance
