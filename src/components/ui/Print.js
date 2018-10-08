import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next'
import jsPDF from 'jspdf';

import * as Nav from '../../components/ui/Nav';

const margins = {
   top: 50,
   left: 60,
   width: 545
};

const page = {
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto'
}

class Print extends Component {

    onPdfRequest(fileName, nodeId) {

        var pdf = new jsPDF('p', 'pt', 'A4');
        var source = document.getElementById(nodeId || 'divToPrint');
        var specialElementHandlers = {
            '#bypassme': function(element, renderer) {
                return true
            }
        };

        pdf.fromHTML(source, margins.left, margins.top, {
          'width': margins.width,
          'elementHandlers': specialElementHandlers
        }, function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF
            // this allow the insertion of new lines after html
            pdf.save(fileName || 'kvittering.pdf');
        })
    }

    render () {

       const { fileName, nodeId, buttonLabel } = this.props;

       return <Nav.Knapp onClick={this.onPdfRequest.bind(this, fileName, nodeId)}>{buttonLabel}</Nav.Knapp>
    }
}

Print.propTypes = {
    fileName    : PT.string,
    nodeId      : PT.string,
    buttonLabel : PT.string.isRequired
};

export default Print;
