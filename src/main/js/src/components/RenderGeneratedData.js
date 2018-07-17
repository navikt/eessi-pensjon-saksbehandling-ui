import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import lodash from 'lodash';
class RenderGeneratedData extends Component {

    renderJson (json, level) {

        let res = [];
        let padding = level * 50;

        for (var key in json) {
            let value = json[key];
            if (typeof value === 'string') {
                if (value !== 'null' && value !== '') {
                    res.push('<div style={{paddingLeft: "' + padding + '"}}><b>' + key + '</b>: ' + value + '</div>');
                }
            } else {
                res.push(this.renderJson(value, level++))
            }
        }
        return lodash.flatten(res).join('');
    }

    render () {

        let { t, dataToGenerate, dataToConfirm } = this.props;

        return <div className='generateData' style={{padding: '10px', border: '1px solid black'}}>
            <div><b>Saks ID</b>: {dataToConfirm.caseId}</div>
            <div><b>Pin ID</b>: {dataToConfirm.actorId}</div>
            <div><b>Fagområde</b>: {dataToConfirm.subjectArea}</div>
            <div><b>BUC</b>: {dataToConfirm.buc}</div>
            <div><b>SED</b>: {dataToConfirm.sed}</div>
            <div><b>Mottaker</b>: {JSON.stringify(dataToConfirm.institutions)}</div>

            {this.renderJson(dataToGenerate, 0)}
        </div>;
    }
}

RenderGeneratedData.propTypes = {
    dataToGenerate : PT.object.isRequired,
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderGeneratedData);
