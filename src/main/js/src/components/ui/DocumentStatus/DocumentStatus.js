import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import Icons from '../Icons';
import * as Nav from '../Nav';

import './DocumentStatus.css';

class DocumentStatus extends Component {

    sortStatusByDocs(status) {

        let res = {};

        status.map(item => {
            if (item.navn !== 'Create') {
                if (!res[item.dokumentType]) {
                    res[item.dokumentType] = {
                        'dokumentId' : item.dokumentId,
                        'aksjoner'   : [item.navn]
                    };
                } else {
                    res[item.dokumentType]['aksjoner'].push(item.navn);
                    res[item.dokumentType]['aksjoner'].sort();
                }
            }
            return item;
        });

        let res2 = Object.keys(res).sort().map(key => {
            return {
                dokumentType : key,
                aksjoner     : res[key].aksjoner,
                dokumentId   : res[key].dokumentId
            }
        });

        return res2;

    }

    getStatus(aksjoner) {
        if (!aksjoner) {
            return null;
        }
        return aksjoner.indexOf('Send') >= 0 ? 'sent' : 'notsent'
    }

    render() {

        const { t, status, className } = this.props;

        let docs = this.sortStatusByDocs(status);

        return <div className={classNames('div-documentStatus', className)}>
            <div className='flex-documentStatus'>
                {docs.map((doc, index) => {
                    let status = this.getStatus(doc.aksjoner);
                    return <Nav.Hovedknapp key={index} className={classNames('document', 'mr-2', status)}
                         title={doc.aksjoner.join(', ')}>
                        <Icons className='mr-3' size='3x' kind='document'/>
                        <div>{doc.dokumentType}</div>
                    </Nav.Hovedknapp>
                })}
            </div>
        </div>
    }
}

DocumentStatus.propTypes = {
    t                 : PT.func.isRequired,
    status            : PT.array.isRequired,
    className         : PT.object
};

export default translate()(DocumentStatus);
