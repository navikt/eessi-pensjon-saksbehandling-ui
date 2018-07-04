import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import * as Nav from './Nav'
import * as languageActions from '../actions/language';

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, languageActions), dispatch)};
};

class LanguageSelector extends Component {

    changeLanguage(e) {

        let { actions } = this.props;
        actions.changeLanguage(e.target.value);
    }

    render () {

        let { t, language } = this.props;
        return <Nav.Select label={t('ui:chooseLanguage')} value={language} onChange={this.changeLanguage.bind(this)}>
            <option value='en'>English</option>
            <option value='nb'>Bokmål</option>
            <option value='nn'>Nynorsk</option>
        </Nav.Select>
    }
}

LanguageSelector.propTypes = {
    language : PT.string.isRequired,
    t        : PT.func.isRequired,
    actions  : PT.object.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(LanguageSelector)
);

