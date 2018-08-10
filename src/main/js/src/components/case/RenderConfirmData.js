import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

class RenderConfirmData extends Component {

    render () {

        let { t, dataToConfirm } = this.props;

        return <div className='confirmData'>
            <div><b>{t('case:caseId')}</b>{': '}{dataToConfirm.caseId}</div>
            <div><b>{t('case:actorId')}</b>{': '}{dataToConfirm.actorId}</div>
            <div><b>{t('case:subjectArea')}</b>{': '}{dataToConfirm.subjectArea}</div>
            <div><b>{t('case:buc')}</b>{': '}{dataToConfirm.buc}</div>
            <div><b>{t('case:sed')}</b>{': '}{dataToConfirm.sed}</div>
            <div><b>{t('case:institution')}</b>{': '}{JSON.stringify(dataToConfirm.institutions)}</div>
        </div>;
    }
}

RenderConfirmData.propTypes = {
    dataToConfirm  : PT.object.isRequired,
    t              : PT.func.isRequired
}

export default translate()(RenderConfirmData);
