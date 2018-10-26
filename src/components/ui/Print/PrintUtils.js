
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

margins = {
    top: 80,
    bottom: 60,
    left: 40,
    width: 522
};
/* const page = {
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto'
} */

const specialElementHandlers = {
  '#bypassme': function (element, renderer) {
    return true
  }
}

class PrintUtils {
  print (options) {
    var pdf = new JsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'A4'
     })

    var source = options.nodeId ? document.getElementById(options.nodeId || 'divToPrint') : options.content
    var fileName = options.fileName || 'kvittering.pdf'

    if (options.useCanvas) {
      html2canvas(source).then((canvas) => {
        const img = canvas.toDataURL('image/png')
        pdf.addImage(img, 'JPEG', 0, 0)
        pdf.save(fileName)
      })
    } else {
      pdf.fromHTML(source, margins.left, margins.top, {
        'width': margins.width,
        'elementHandlers': specialElementHandlers
      }, function () {
        pdf.save(fileName)
      }, margins)
    }
  }
}

const instance = new PrintUtils()
Object.freeze(instance)
export default instance
