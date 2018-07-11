import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

class RenderGeneratedData extends Component {

    render () {

        let { t, dataToGenerate, dataToConfirm } = this.props;

        return <div style={{padding: '10px', border: '1px solid black'}}>
            <div><b>Saks ID</b>: {dataToConfirm.caseId}</div>
            <div><b>Fagområde</b>: {dataToConfirm.subjectArea}</div>
            <div><b>BUC</b>: {dataToConfirm.buc}</div>
            <div><b>SED</b>: {dataToConfirm.sed}</div>
            <div><b>Mottaker</b>: {JSON.stringify(dataToConfirm.institutions)}</div>

            <div><b>NAV bruker</b>: {dataToGenerate.nav ? dataToGenerate.nav.bruker : null}</div>
            <div><b>NAV eessisak</b>: {dataToGenerate.nav ? dataToGenerate.nav.eessisak : null}</div>
            <div><b>SED</b>: {dataToGenerate.sed}</div>
            <div><b>sedGVer</b>: {dataToGenerate.sedGVer}</div>
            <div><b>sedVer</b>: {dataToGenerate.sedVer}</div>
            <div><b>pensjon reduksjon</b>: {dataToGenerate.pensjon ? dataToGenerate.pensjon.reduksjon : null}</div>
            <div><b>pensjon vedtak</b>: {dataToGenerate.pensjon ? dataToGenerate.pensjon.vedtak : null}</div>
            <div><b>pensjon sak</b>: {dataToGenerate.pensjon? dataToGenerate.pensjon.sak : null}</div>
            <div><b>pensjon gjenlevende</b>: {dataToGenerate.pensjon? dataToGenerate.pensjon.gjenlevende : null}</div>
            <div><b>pensjon tilleggsinformasjon</b>: {dataToGenerate.pensjon? dataToGenerate.pensjon.tilleggsinformasjon : null}</div>
            <div><b>ignore</b>: {dataToGenerate.ignore}</div>
        </div>;
    }
}

RenderGeneratedData.propTypes = {
    dataToGenerate : PT.object.isRequired,
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderGeneratedData);
