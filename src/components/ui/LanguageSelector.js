import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import i18n from '../../i18n';

import * as Nav from './Nav'
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        language : state.ui.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};

class LanguageSelector extends Component {

    changeLanguage(e) {

        let { actions } = this.props;
        actions.changeLanguage(e.target.value);
    }

    render () {

        let { t, language } = this.props;
        let thisLanguage = language || i18n.language;

        return <Nav.Select bredde='xl' className='languageSelector' label={t('ui:chooseLanguage')}
            value={thisLanguage} onChange={this.changeLanguage.bind(this)}>
            <option value='en-gb'>{'English'}</option>
            <option value='nb'>{'Norsk Bokmål'}</option>
        </Nav.Select>
    }
}

LanguageSelector.propTypes = {
    language : PT.string,
    t        : PT.func.isRequired,
    actions  : PT.object.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(LanguageSelector)
);

