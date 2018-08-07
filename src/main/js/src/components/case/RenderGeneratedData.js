import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

class RenderGeneratedData extends Component {

    renderJson (json, level) {

        let res = [];

        for (var key in json) {
            let value = json[key];
            if (typeof value === 'string') {
                if (value !== 'null' && value !== '') {
                    res.push(<div style={{paddingLeft: level * 50 }}><b>{key}</b>{': '}{value}</div>);
                }
            } else {
                res.push(this.renderJson(value, level++));
            }
        }

        return _.flatten(res);
    }

    render () {

        let { t, dataToGenerate, dataToConfirm } = this.props;

        return <div className='generateData' style={{padding: '10px', border: '1px solid black'}}>
            <div><b>{t('case:caseId')}</b>{': '}{dataToConfirm.caseId}</div>
            <div><b>{t('case:actorId')}</b>{': '}{dataToConfirm.actorId}</div>
            <div><b>{t('case:subjectArea')}</b>{': '}{dataToConfirm.subjectArea}</div>
            <div><b>{t('case:buc')}</b>{': '}{dataToConfirm.buc}</div>
            <div><b>{t('case:sed')}</b>{': '}{dataToConfirm.sed}</div>
            <div><b>{t('case:institution')}</b>{': '}{JSON.stringify(dataToConfirm.institutions)}</div>
            {this.renderJson(dataToGenerate, 0).map(i => { return i})}
        </div>;
    }
}

RenderGeneratedData.propTypes = {
    dataToGenerate : PT.object.isRequired,
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderGeneratedData);
