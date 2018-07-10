import React, { Component } from 'react';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import StepIndicator from '../components/StepIndicator';
import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        dataSubmitted : state.usercase.dataSubmitted,
        rinaUrl       : state.usercase.rinaUrl,
        rinaLoading   : state.loading.rinaUrl
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class EndCase extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

        let { actions } = this.props;
        actions.getRinaUrl();
    }

    onForwardButtonClick() {

        const { history, actions } = this.props;
        actions.clearData();
        history.push('/react/get');
    }

    render() {

        let { t, dataSubmitted, rinaLoading, rinaUrl } = this.props;

        let body;

        if (rinaLoading) {
            body = t('loading:loadingRina')
        } else {
            if (rinaUrl && dataSubmitted && dataSubmitted.euxcaseid) {
                body = <a href={rinaUrl + dataSubmitted.euxcaseid}>{t('ui:caseLink')}</a>
            } else {
                body = null;
            }
       }

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
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>
                        <StepIndicator activeStep={3}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        {body}
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
    actions       : PT.object,
    history       : PT.object,
    dataSubmitted : PT.object,
    t             : PT.func,
    rinaLoading   : PT.bool,
    rinaUrl       : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EndCase)
);
