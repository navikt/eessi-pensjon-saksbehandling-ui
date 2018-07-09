import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import './TopHeader.css';
import * as navLogo from '../resources/images/nav.svg';

class TopHeader extends Component {

    render () {

        let { t } = this.props;

        return <header className="topplinje">
            <div className="topplinje__brand">
                <Link to="/" alt="NAV, lenke hovedsiden">
                    <img className="brand__logo" src={navLogo} alt="To personer på NAV kontor"/>
                </Link>
                <div className="brand__skillelinje" />
                <div className="brand__tittel"><span>{t('content:headerTitle')}</span></div>
            </div>
            <div className="topplinje__saksbehandler">
                <div className="saksbehandler__navn">Firstname lastname</div>
            </div>
        </header>
    }
}

TopHeader.propTypes = {
    t : PT.func.isRequired
};

export default translate()(TopHeader);
