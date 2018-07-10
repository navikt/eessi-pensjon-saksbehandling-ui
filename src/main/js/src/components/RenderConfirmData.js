import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

class RenderConfirmData extends Component {

    render () {

        let { t, dataToConfirm } = this.props;

        return <div style={{padding: '10px', border: '1px solid black'}}>
             <div><b>Saks ID</b>: {dataToConfirm.caseId}</div>
             <div><b>Fagområde</b>: {dataToConfirm.subjectArea}</div>
             <div><b>BUC</b>: {dataToConfirm.buc}</div>
             <div><b>SED</b>: {dataToConfirm.sed}</div>
             <div><b>Mottaker</b>: {JSON.stringify(dataToConfirm.institutions)}</div>
        </div>;
    }
}

RenderConfirmData.propTypes = {
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderConfirmData);
