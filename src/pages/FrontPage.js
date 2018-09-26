import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import 'url-search-params-polyfill';

import LanguageSelector from '../components/ui/LanguageSelector';
import TopContainer from '../components/ui/TopContainer';
import * as Nav from '../components/ui/Nav';
import DocumentStatus from '../components/ui/DocumentStatus/DocumentStatus';

import * as routes from '../constants/routes';
import * as statusActions from '../actions/status';
import * as appActions from '../actions/app';

const mapStateToProps = (state) => {
    return {
        language      : state.ui.language,
        gettingStatus : state.loading.gettingStatus,
        status        : state.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch)};
};

class FrontPage extends Component {

    getCreateableDocuments(status) {

        return status.docs ? status.docs
            .filter(item => {return item.navn === 'Create'})
            .sort((a, b) => {return (a.dokumentType > b.dokumentType) ? 1 : ((a.dokumentType < b.dokumentType) ? -1 : 0)})
            : [];
    }

    render() {

        const { t, language, gettingStatus, history, status, location } = this.props;

        return <TopContainer className='frontPage topContainer' language={language} history={history} location={location}>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='appTitle'>{t('pageTitle')}</h1>
                    <h4 className='appDescription'>{t('pageDescription')}</h4>
                    <div className='col text-center m-auto'>
                        <LanguageSelector/>
                    </div>
                    <div className='col text-center m-auto'>
                        <a href='https://loginservice.nais.adeo.no/login?redirect=https://eux-app.nais.preprod.local/swagger-ui.html/'>{'LOGINSERVICE'}</a>
                    </div>

                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 m-4'>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        {_.isEmpty(status.documents) ? (gettingStatus ? <div>
                            <h4 className='mb-4'>{t('status')}</h4>
                            <div className='w-100 text-center'>
                                <Nav.NavFrontendSpinner/>
                                <p>{t('ui:gettingStatus')}</p>
                            </div>
                        </div>: null) : <div>
                            <h4 className='mb-4'>{t('status')}</h4>
                            <DocumentStatus history={history}/>
                        </div> }
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        <h4 className='mb-4'>{t('forms')}</h4>
                        <Nav.Lenkepanel className='frontPageLink caseLink' linkCreator={(props) => (
                            <Link to={
                            status.saksNr ?
                            routes.CASE_EDIT_WITHOUT_RINA
                                .replace(':actorid', status.fnr)
                                .replace(':caseid', status.saksNr)
                            : routes.CASE_GET
                            } {...props}/>)
                        } href="#">{t('case:app-createNewCase')}</Nav.Lenkepanel>
                        <Nav.Lenkepanel className='frontPageLink pSelvLink' linkCreator={(props) => (
                            <Link to={routes.PSELV} {...props}/>)
                        } href="#">{t('pselv:app-startPselv')}</Nav.Lenkepanel>
                        <Nav.Lenkepanel className='frontPageLink pInfoLink' linkCreator={(props) => (
                            <Link to={routes.PINFO} {...props}/>)
                        } href="#">{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
                        {status ? this.getCreateableDocuments(status).map(item => <Nav.Lenkepanel
                            className={'frontPageLink ' + item.dokumentType + 'Link'}
                            key={item.dokumentType}
                            linkCreator={(props) => (
                                <Link to={routes.ROOT + item.dokumentType} {...props}/>)
                            } href="#">{t(item.dokumentType + ':app-start' + item.dokumentType)}
                        </Nav.Lenkepanel>) : null}
                        <Nav.Lenkepanel
                            className='frontPageLink p4000Link' linkCreator={(props) => (
                                <Link to={routes.P4000} {...props}/>)
                            } href="#">{t('p4000:app-startP4000')}</Nav.Lenkepanel>

                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        <h4 className='mb-4'>{t('tools')}</h4>
                        <Nav.Lenkepanel className='frontPageLink pdfLink' linkCreator={(props) => (
                            <Link to={routes.PDF_SELECT} {...props}/>)
                        } href="#">{t('pdf:app-createPdf')}</Nav.Lenkepanel>
                    </Nav.Column>
                </Nav.Row>
            </div>
        </TopContainer>
    }
}

FrontPage.propTypes = {
    language      : PT.string,
    location      : PT.object.isRequired,
    t             : PT.func.isRequired,
    actions       : PT.object.isRequired,
    gettingStatus : PT.bool,
    status        : PT.object,
    history       : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(FrontPage)
);
