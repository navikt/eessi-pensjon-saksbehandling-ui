import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import Icons from '../Icons';
import * as Nav from '../Nav';

import * as routes from '../../../constants/routes';
import * as statusActions from '../../../actions/status';
import * as p4000Actions from '../../../actions/p4000';
import P4000Util from  '../../../components/p4000/Util';

import './DocumentStatus.css';

const mapStateToProps = (state) => {
    return {
        sed           : state.status.sed,
        rinaId        : state.status.rinaId,
        documents     : state.status.documents,
        gettingSED    : state.loading.gettingSED,
        loadingStatus : state.loading.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, statusActions, p4000Actions), dispatch)};
};

const sortStatusByDocs = (documents) => {

    let res = {};

    if (!documents) {
        return [];
    }

    documents.map(item => {
        item.navn !== 'Create' && res[item.dokumentType] ?
            res[item.dokumentType]['aksjoner'].push(item.navn) &&
            res[item.dokumentType]['aksjoner'].sort()
            :
            res[item.dokumentType] = {
                'dokumentId' : item.dokumentId,
                'aksjoner'   : [item.navn]
            };
        return item;
    });

    return Object.keys(res).sort().map(key => {
        return {
            dokumentType : key,
            aksjoner     : res[key].aksjoner,
            dokumentId   : res[key].dokumentId
        }
    });
}

const P4000 = 'P4000';

class DocumentStatus extends Component {

    state = {
        docs: undefined,
        sed : undefined
    }

    static getDerivedStateFromProps (nextProps, prevState) {

        return {
            docs: nextProps.documents ? sortStatusByDocs(nextProps.documents) : undefined,
            sed: !_.isEqual(nextProps.sed, prevState.sed) ? nextProps.sed : prevState.sed
        };
    }

    componentDidUpdate () {

        const { sed } = this.state;

        if (sed) {
            this.redirectToSed(sed);
        }
    }

    redirectToSed (sed) {

        const { actions, history } = this.props;

        this.setState({
            doc : undefined
        });

        switch (sed.sed) {

        case P4000: {

            let events = P4000Util.convertP4000SedToEvents(sed);
            actions.openP4000Success(events);
            actions.setPage('new');
            history.push(routes.P4000);
            break;
        }
        default:
            break;
        }
    }

    getDocumentButtonClass(_doc) {

        const { loadingStatus } = this.props;
        const { doc, requestedDokumentId } = this.state;

        if (!_doc.aksjoner) {
            return null;
        }
        if (loadingStatus === 'ERROR' && requestedDokumentId === _doc.dokumentId) {
            return 'error';
        }
        return _doc.aksjoner.indexOf('Send') >= 0 ? 'sent' : 'notsent'
    }

    toogleDocumentStatus(_doc) {

        if (!this.state.doc) {
            this.setState({
                doc : _doc
            });
        } else {
            if (this.state.doc.dokumentId === _doc.dokumentId) {
                this.setState({
                     doc : undefined
                })
            } else {
                this.setState({
                     doc : _doc
                })
            }
        }
    }

    handleDocumentClick(doc, aksjoner) {

        const { rinaId, actions } = this.props;

        switch (aksjoner) {

            case 'Read':
            case 'Update':
            case 'Delete':
            case 'Create':
            actions.getSed(rinaId, doc.dokumentId);
            break;
            default:
            break;
        }

        this.setState({
            requestedDokumentId : doc.dokumentId
        });
    }

    render() {

        const { t, className, gettingSED } = this.props;
        const { docs, doc } = this.state;

        return <div className={classNames('c-ui-documentStatus', {
            collapsed: !doc,
            expanded : doc
        }, className)}>
            <div className='documentButtons'>
                {docs.map((_doc, index) => {
                    let active = doc ? _doc.dokumentId === doc.dokumentId : false;
                    return <div className='documentButton' style={{animationDelay: index * 0.05 + 's'}}>
                    <Nav.Hovedknapp key={index}
                        className={classNames('documentButtonContent', 'mr-2',
                        {'active' : active },
                        this.getDocumentButtonClass(_doc))}
                        onClick={this.toogleDocumentStatus.bind(this, _doc)}>
                        {gettingSED && active ? <Nav.NavFrontendSpinner style={{position: 'absolute', top: '1rem'}}/> : null}
                        <Icons className='mr-3' size='3x' kind='document'/>
                        <div>{_doc.dokumentType}</div>
                    </Nav.Hovedknapp>
                    </div>
                })}
            </div>
            {doc ? <div className='documentActions'>
                <div>{t('documentType') + ': ' + doc.dokumentType}</div>
                <div>{t('documentId') + ': ' + doc.dokumentId}</div>
                {doc.aksjoner.map((aksjon, index) => {
                    return <Nav.Hovedknapp className='mr-2' key={index} onClick={this.handleDocumentClick.bind(this, doc, aksjon)}>
                    {t(aksjon.toLowerCase())}
                    </Nav.Hovedknapp>
                })}
            </div> : null}
        </div>
    }
}

DocumentStatus.propTypes = {
    t                 : PT.func.isRequired,
    rinaId            : PT.string,
    className         : PT.object,
    history           : PT.object.isRequired,
    actions           : PT.object.isRequired,
    loadingStatus     : PT.string,
    gettingSED        : PT.bool
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DocumentStatus)
);
