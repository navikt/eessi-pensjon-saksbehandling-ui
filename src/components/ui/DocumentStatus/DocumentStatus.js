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
            dokumentId : undefined
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

    getClass(doc) {

        const { loadingStatus } = this.props;
        const { dokumentId } = this.state;

        if (!doc.aksjoner) {
            return null;
        }
        if (loadingStatus === 'ERROR' && doc.dokumentId === dokumentId) {
            return 'error';
        }
        return doc.aksjoner.indexOf('Send') >= 0 ? 'sent' : 'notsent'
    }

    documentClick(doc) {

        const { rinaId, actions } = this.props;

        this.setState({
            dokumentId : doc.dokumentId
        });

        actions.getSed(rinaId, doc.dokumentId);
    }

    render() {

        const { t, className, gettingSED } = this.props;
        const { docs, dokumentId } = this.state;

        return <div className={classNames('div-documentStatus', className)}>
            <div className='flex-documentStatus'>
                {docs.map((doc, index) => {
                    return <Nav.Hovedknapp key={index} style={{animationDelay: index * 0.05 + 's'}} className={classNames('document', 'mr-2', this.getClass(doc))}
                        title={doc.aksjoner.map(aks => {return t(aks.toLowerCase())}).join(', ')}
                        onClick={this.documentClick.bind(this, doc)}>
                        {gettingSED && doc.dokumentId === dokumentId ? <Nav.NavFrontendSpinner style={{position: 'absolute', top: '1rem'}}/> : null}
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
