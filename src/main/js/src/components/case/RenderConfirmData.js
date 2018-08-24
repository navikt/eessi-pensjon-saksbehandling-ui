import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import './RenderData.css';

class RenderConfirmData extends Component {

    render () {

        let { t, dataToConfirm } = this.props;

        return <div className='p-3 renderData'>
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
        </div>;
    }
}

RenderConfirmData.propTypes = {
    dataToConfirm : PT.object.isRequired,
    t             : PT.func.isRequired
}

export default translate()(RenderConfirmData);
