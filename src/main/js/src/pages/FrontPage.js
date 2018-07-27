import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import LanguageSelector from '../components/ui/LanguageSelector';
import TopContainer from '../components/ui/TopContainer';
import * as Nav from '../components/ui/Nav'

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    }
};

class FrontPage extends Component {

    render() {

        const { t, language } = this.props;

        return <TopContainer language={language}>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='mt-3 appTitle'>{t('pageTitle')}</h1>
                    <h4>{t('pageDescription')}</h4>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4 text-center'>
                <Nav.Column className='col-4 m-auto'>
                    <LanguageSelector/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4 text-left'>
                <Nav.Column>
                    <Nav.Lenkepanel className='frontPageLink' linkCreator={(props) => (
                        <Link to='/react/case/get' {...props}/>)
                    } href="#">{t('case:createNewCase')}</Nav.Lenkepanel>
                    <Nav.Lenkepanel className='frontPageLink' linkCreator={(props) => (
                        <Link to='/react/pdf/select' {...props}/>)
                    } href="#">{t('pdf:createPdf')}</Nav.Lenkepanel>
                    <Nav.Lenkepanel className='frontPageLink' linkCreator={(props) => (
                        <Link to='/react/p4000' {...props}/>)
                    } href="#">{t('p4000:startP4000')}</Nav.Lenkepanel>
                </Nav.Column>
            </Nav.Row>
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
