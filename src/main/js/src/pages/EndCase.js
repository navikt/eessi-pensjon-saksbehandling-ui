import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

const mapStateToProps = (state) => {
    return {
        dataSubmitted : state.usercase.dataSubmitted,
        language      : state.ui.language
    };
};

class EndCase extends Component {

    onForwardButtonClick() {

        const { history } = this.props;
        history.push('/react/get');
    }

    render() {

        let { t, dataSubmitted } = this.props;

        return <TopContainer>
            <Nav.Panel>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        {t('content:endCaseDescription')}
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.AlertStripe type='suksess'>{t('ui:dataSubmitted')}</Nav.AlertStripe>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        {JSON.stringify(dataSubmitted)}
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Hovedknapp className='mr-3' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}

EndCase.propTypes = {
    actions       :  PropTypes.object,
    history       :  PropTypes.object,
    dataSubmitted : PropTypes.object,
    t             : PropTypes.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(EndCase)
);
