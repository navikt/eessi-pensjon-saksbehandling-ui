import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

class FrontPage extends Component {

    render () {

        let { t } = this.props;

        return <div className="topplinje__brand">
              Empty Page
        </div>
    }
}

FrontPage.propTypes = {
    t : PT.func.isRequired
};

export default FrontPage;
