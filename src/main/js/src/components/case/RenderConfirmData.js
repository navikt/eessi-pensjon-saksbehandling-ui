import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

class RenderConfirmData extends Component {

    render () {

        let { t, dataToConfirm } = this.props;

        return <div className='confirmData'>
            <div><b>{t('case:form-caseId')}</b>{': '}{dataToConfirm.caseId}</div>
            <div><b>{t('case:form-actorId')}</b>{': '}{dataToConfirm.actorId}</div>
            <div><b>{t('case:form-rinaId')}</b>{': '}{dataToConfirm.rinaId}</div>
            <div><b>{t('case:form-subjectArea')}</b>{': '}{dataToConfirm.subjectArea}</div>
            <div><b>{t('case:form-buc')}</b>{': '}{dataToConfirm.buc}</div>
            <div><b>{t('case:form-sed')}</b>{': '}{dataToConfirm.sed}</div>
            <div><b>{t('case:form-institution')}</b>{': '}{dataToConfirm.institutions.map((inst, i) => {
                return <div className='d-inline-block'>
                    <img src={'../../../../flags/' + inst.country + '.png'}
                       style={{width: 30, height: 20}}
                       alt={inst.country}/>&nbsp; {inst.institution}
                   </div>
            })}</div>
        </div>;
    }
}

RenderConfirmData.propTypes = {
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderConfirmData);
