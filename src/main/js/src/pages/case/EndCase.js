import React, { Component } from 'react';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import StepIndicator from '../../components/case/StepIndicator';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import Icons from '../../components/ui/Icons';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as usercaseActions from '../../actions/usercase';

import './case.css';

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

    state = {};

    componentDidMount() {

        let { actions } = this.props;
        actions.getRinaUrl();
    }

    onForwardButtonClick() {

        const { history, actions } = this.props;

        actions.clearData();
        history.push('/react/case/get');
    }

    render() {

        let { t, history, dataSubmitted, rinaLoading, rinaUrl } = this.props;

        let body;

        if (rinaLoading) {
            body = t('case:loading.rina')
        } else {
            if (rinaUrl && dataSubmitted && dataSubmitted.euxcaseid) {
                body = <a href={rinaUrl + dataSubmitted.euxcaseid}>{t('case:form-caseLink')}</a>
            } else {
                body = null;
            }
        }

        return <TopContainer className='case topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('case:app-endCaseTitle')}
                    </h1>
                    <h4>{t('case:app-endCaseDescription')}</h4>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <ClientAlert className='mb-3'/>
                    <StepIndicator activeStep={3}/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column className='endCase'>
                        {body}
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row>
                <Nav.Column>
                    <Nav.Hovedknapp className='mr-3 forwardButton' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
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
