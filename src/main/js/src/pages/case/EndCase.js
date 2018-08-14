import React, { Component } from 'react';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Case from './Case';
import * as Nav from '../../components/ui/Nav';

import * as usercaseActions from '../../actions/usercase';

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

        return <Case className='endCase'
            title='case:app-endCaseTitle' description='case:app-endCaseDescription'
            stepIndicator={3} history={history}>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column className='endCase'>
                        {body}
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    <Nav.Hovedknapp className='mr-3 forwardButton' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </Case>;
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
