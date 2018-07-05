import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';
import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.usercase.errorMessage,
        errorStatus  : state.usercase.errorStatus,
        currentCase  : state.usercase.currentCase,
        loading      : state.loading,
        language     : state.ui.language
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class GetCase extends Component {

    constructor(props) {

        super(props);
        this.state = {};
    }

    onCaseIdChange (e) {

        this.setState({caseId: e.target.value});
    }

    onCaseHandlerChange (e) {

        this.setState({caseHandler: e.target.value});
    }

    onButtonClick() {

        const {actions} = this.props;
        actions.getCaseFromCaseNumber(this.state);
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;
        if (nextProps.currentCase && nextProps.currentCase.hasOwnProperty('casenumber')) {
            history.push('/react/get/' + nextProps.currentCase.casenumber);
        }
    }

    isButtonDisabled() {
        return !this.state.caseId && !this.state.caseHandler;
    }

    render() {

        const { t, errorMessage, errorStatus, loading } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let spinner    = loading && loading.getcase;
        let buttonText = spinner ? t('loading:getcase') : t('søk');

        return <TopContainer>
            <Nav.Panel className='panel'>
                <Nav.Row className='mt-4'>
                   <Nav.Column>{t('content:getCaseDescription')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        <Nav.Input label={t('ui:caseId')} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                    </Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase id="caseId" type="under">{t('help:caseId')}</Nav.HjelpetekstBase>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row  className='mt-4 text-left'>
                    <Nav.Column>
                        <Nav.Input label={t('ui:caseHandler')} value={this.state.caseHandler} onChange={this.onCaseHandlerChange.bind(this)}/>
                    </Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase id="caseHandler" type="under">{t('help:caseHandler')}</Nav.HjelpetekstBase>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Hovedknapp spinner={spinner} disabled={this.isButtonDisabled()} onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

GetCase.propTypes = {
    currentCase  : PT.object,
    errorMessage : PT.string,
    errorStatus  : PT.string,
    loading      : PT.object,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GetCase)
);
