import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import LanguageSelector from '../components/ui/LanguageSelector';
import TopContainer from '../components/ui/TopContainer';
import * as Nav from '../components/ui/Nav';
import Icons from '../components/ui/Icons';
import DocumentStatus from '../components/ui/DocumentStatus/DocumentStatus';

import * as statusActions from '../actions/status';

const mapStateToProps = (state) => {
    return {
        language      : state.ui.language,
        gettingStatus : state.loading.gettingStatus,
        status        : state.status.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, statusActions), dispatch)};
};

class FrontPage extends Component {

    state = {}

    componentDidMount() {

        const { actions, location } = this.props;

        const params = new URLSearchParams(location.search);

        if (params.get('rinaId')) {
            actions.getStatus(params.get('rinaId'));
        }
    }

    getCreateableDocuments(status) {

        return status
            .filter(item => {return item.navn === 'Create'})
            .sort((a, b) => {return (a.dokumentType > b.dokumentType) ? 1 : ((a.dokumentType < b.dokumentType) ? -1 : 0)});
    }

    render() {

        const { t, language, gettingStatus, status } = this.props;

        return <TopContainer className='frontPage topContainer' language={language}>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='appTitle'>
                        <Icons style={{opacity: 0}} size={'lg'} title={t('ui:back')} className='mr-3' kind='caretLeft'/>
                        {t('pageTitle')}
                    </h1>
                    <h4 className='appDescription'>{t('pageDescription')}</h4>
                    <div className='col-4 text-center m-auto'>
                        <LanguageSelector/>
                    </div>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 m-4'>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        {_.isEmpty(status) ? (gettingStatus ? <div>
                            <h4 className='mb-4'>{t('status')}</h4>
                            <div className='w-100 text-center'>
                                <Nav.NavFrontendSpinner/>
                                <p>{t('ui:gettingStatus')}</p>
                            </div>
                        </div>: null) : <div>
                            <h4 className='mb-4'>{t('status')}</h4>
                            <DocumentStatus status={status}/>
                        </div> }
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        <h4 className='mb-4'>{t('forms')}</h4>
                        <Nav.Lenkepanel className='frontPageLink caseLink' linkCreator={(props) => (
                            <Link to='/react/case/get' {...props}/>)
                        } href="#">{t('case:app-createNewCase')}</Nav.Lenkepanel>
                        <Nav.Lenkepanel className='frontPageLink pInfoLink' linkCreator={(props) => (
                            <Link to='/react/pinfo' {...props}/>)
                        } href="#">{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
                        {status ? this.getCreateableDocuments(status).map(item => <Nav.Lenkepanel
                            className={'frontPageLink ' + item.dokumentType + 'Link'}
                            key={item.dokumentType}
                            linkCreator={(props) => (
                                <Link to={'/react/' + item.dokumentType} {...props}/>)
                            } href="#">{t(item.dokumentType + ':app-start' + item.dokumentType)}
                        </Nav.Lenkepanel>) : null}
                        <Nav.Lenkepanel
                            className='frontPageLink p4000Link' linkCreator={(props) => (
                                <Link to='/react/P4000' {...props}/>)
                            } href="#">{t('p4000:app-startP4000')}</Nav.Lenkepanel>

                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        <h4 className='mb-4'>{t('tools')}</h4>
                        <Nav.Lenkepanel className='frontPageLink pdfLink' linkCreator={(props) => (
                            <Link to='/react/pdf/select' {...props}/>)
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
    status        : PT.array
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(FrontPage)
);
