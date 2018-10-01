import React, { Component } from 'react';

import ExternalFiles from '../pdf/ExternalFiles/ExternalFiles';

class Pdf extends Component {

    render () {

        return <div className="topplinje__brand">
            <ExternalFiles/>
        </div>
    }
}

Pdf.propTypes = {
};

export default Pdf;
