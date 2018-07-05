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
                <div>{t('content:endCaseDescription')}</div>
                <div className='mx-4 text-center'>
                    <div className='mt-4'>
                        <Nav.AlertStripe type='suksess'>{t('dataSubmitted')}</Nav.AlertStripe>
                    </div>
                    <div className='mt-4'>
                        {JSON.stringify(dataSubmitted)}
                    </div>
                    <div className='mt-4'>
                        <Nav.Hovedknapp className='mr-3' onClick={this.onForwardButtonClick.bind(this)}>{t('createNew')}</Nav.Hovedknapp>
                    </div>
                </div>
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
