import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import LanguageSelector from '../components/LanguageSelector';
import TopContainer from '../components/TopContainer';
import * as Nav from '../components/Nav'

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    }
};

class Index extends Component {

    render() {

        const { t } = this.props;

        return <TopContainer>
            <Nav.Panel className='panel'>
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
                        <Nav.Lenkepanel href="/react/get">{t('ui:createNewCase')}</Nav.Lenkepanel>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

Index.propTypes = {
    usercase     : PropTypes.object,
    error        : PropTypes.object,
    serverError  : PropTypes.object,
    actions      : PropTypes.object,
    history      : PropTypes.object,
    t            : PropTypes.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(Index)
);
