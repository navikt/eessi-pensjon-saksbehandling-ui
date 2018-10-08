import React, { Component } from 'react';
import PT from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import * as Nav from '../../components/ui/Nav';

const margins = {
    top: 50,
    left: 60,
    width: 545
};

/*const page = {
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto'
}*/

class Print extends Component {

    state = {
        useCanvas : false
    }

    onPdfRequest(fileName, nodeId) {

        var pdf = new jsPDF('p', 'pt', 'A4');
        var source = document.getElementById(nodeId || 'divToPrint');

        var useCanvas = this.props.useCanvas || this.state.useCanvas;

        if (useCanvas) {
            html2canvas(source).then((canvas) => {
                const img = canvas.toDataURL('image/png');
                pdf.addImage(img,'JPEG',0,0);
                pdf.save(fileName || 'kvittering.pdf');
            })
        } else {

            var specialElementHandlers = {
                '#bypassme': function(element, renderer) {
                    return true
                }
            };
            pdf.fromHTML(source, margins.left, margins.top, {
                'width': margins.width,
                'elementHandlers': specialElementHandlers
            }, function () {
                pdf.save(fileName || 'kvittering.pdf');
            })
        }
    }

    render () {

        const { fileName, nodeId, buttonLabel } = this.props;

        return <Nav.Knapp onClick={this.onPdfRequest.bind(this, fileName, nodeId)}>{buttonLabel}</Nav.Knapp>
    }
}

Print.propTypes = {
    fileName    : PT.string,
    nodeId      : PT.string,
    useCanvas   : PT.bool,
    buttonLabel : PT.string.isRequired
};

export default Print;
