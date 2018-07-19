import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import LanguageSelector from '../components/LanguageSelector';
import TopContainer from '../components/TopContainer';
import * as Nav from '../components/Nav'

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    }
};

class FrontPage extends Component {

    render() {

        const { t, language } = this.props;

        return <TopContainer language={language}>
            <Nav.Panel>
                <Nav.Row>
                    <Nav.Column>{t('content:indexDescription')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        <LanguageSelector/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        <Link to='/react/get'>
                            <Nav.Lenkepanel className='frontPageLink' href="#">{t('ui:createNewCase')}</Nav.Lenkepanel>
                        </Link>
                         <Link to='/react/selectPDF'>
                            <Nav.Lenkepanel className='frontPageLink' href="#">{t('ui:createPdf')}</Nav.Lenkepanel>
                         </Link>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
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
