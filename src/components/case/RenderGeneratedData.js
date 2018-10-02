import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import './RenderData.css';

class RenderGeneratedData extends Component {

    renderJson (json, level) {

        let res = [];

        for (var key in json) {
            let value = json[key];
            if (typeof value === 'string') {
                if (value !== 'null' && value !== '') {
                    res.push(<div style={{paddingLeft: level * 12 }}><b>{key}</b>{': '}{value}</div>);
                }
            } else {
                res.push(this.renderJson(value, level++));
            }
        }

        return _.flatten(res);
    }

    render () {

        let { t, dataToGenerate, dataToConfirm } = this.props;


        return <div className='p-3 c-case-renderData'>
            <dl className='row'>
                <dt className='col-sm-4'><label>{t('case:form-caseId')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.caseId}</dd>
                <dt className='col-sm-4'><label>{t('case:form-actorId')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.actorId}</dd>
                <dt className='col-sm-4'><label>{t('case:form-rinaId')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.rinaId}</dd>
                <dt className='col-sm-4'><label>{t('case:form-subjectArea')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.subjectArea}</dd>
                <dt className='col-sm-4'><label>{t('case:form-buc')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.buc}</dd>
                <dt className='col-sm-4'><label>{t('case:form-sed')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.sed}</dd>
                <dt className='col-sm-4'><label>{t('case:form-institution')}</label></dt>
                <dd className='col-sm-8'>{dataToConfirm.institutions.map((inst, i) => {
                    return <div key={i} className='d-inline-block'>
                        <img src={'../../../../flags/' + inst.country + '.png'}
                            style={{width: 30, height: 20}}
                            alt={inst.country}/>&nbsp; {inst.institution}
                    </div>
                })}</dd>
            </dl>
            {this.renderJson(dataToGenerate, 0).map(html => { return html})}
        </div>;
    }
}

RenderGeneratedData.propTypes = {
    dataToGenerate : PT.object.isRequired,
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderGeneratedData);
