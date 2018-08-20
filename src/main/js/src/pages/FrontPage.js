import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import LanguageSelector from '../components/ui/LanguageSelector';
import TopContainer from '../components/ui/TopContainer';
import * as Nav from '../components/ui/Nav'
import Icons from '../components/ui/Icons'

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    }
};

class FrontPage extends Component {

    render() {

        const { t, language } = this.props;

        return <TopContainer className='frontPage topContainer' language={language}>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='appTitle'>
                        <Icons style={{opacity: 0}} size={'lg'} title={t('ui:back')} className='mr-3' kind='caretLeft'/>
                        {t('pageTitle')}
                    </h1>
                    <h4 className='appDescription'>{t('pageDescription')}</h4>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='m-4'>
                <Nav.Column className='col-4 text-center m-auto'>
                    <LanguageSelector/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 m-4'>
                <Nav.Row className='mb-4'>
                    <Nav.Column>
                        <h4 className='mb-4'>{t('forms')}</h4>
                        <Nav.Lenkepanel className='frontPageLink caseLink' linkCreator={(props) => (
                            <Link to='/react/case/get' {...props}/>)
                        } href="#">{t('case:app-createNewCase')}</Nav.Lenkepanel>
                        <Nav.Lenkepanel className='frontPageLink pInfolink' linkCreator={(props) => (
                            <Link to='/react/pinfo' {...props}/>)
                        } href="#">{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
                        <Nav.Lenkepanel className='frontPageLink p4000link' linkCreator={(props) => (
                            <Link to='/react/p4000' {...props}/>)
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
    language : PT.string,
    t        : PT.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(FrontPage)
);
