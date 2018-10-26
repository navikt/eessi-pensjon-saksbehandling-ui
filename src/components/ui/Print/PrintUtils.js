
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const margins = {
  top: 50,
  left: 60,
  width: 545
}

/* const page = {
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto'
} */

class PrintUtils {
  print (options) {
    var pdf = new JsPDF('p', 'pt', 'A4')
    var source = options.nodeId ? document.getElementById(options.nodeId || 'divToPrint') : null
    if (options.content) {
      source = options.content
    }

    if (options.useCanvas) {
      html2canvas(source).then((canvas) => {
        const img = canvas.toDataURL('image/png')
        pdf.addImage(img, 'JPEG', 0, 0)
        pdf.save(options.fileName || 'kvittering.pdf')
      })
    } else {
      var specialElementHandlers = {
        '#bypassme': function (element, renderer) {
          return true
        }
      }
      pdf.fromHTML(source, margins.left, margins.top, {
        'width': margins.width,
        'elementHandlers': specialElementHandlers
      }, function () {
        pdf.save(options.fileName || 'kvittering.pdf')
      })
    }
  }
}

const instance = new PrintUtils()
Object.freeze(instance)
export default instance
