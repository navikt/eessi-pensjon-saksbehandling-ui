import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from './Nav'
import TopHeader from './TopHeader';
import AlertHeader from './AlertHeader';

class TopContainer extends Component {

    render () {

        let { t } = this.props;

        return <div className='h-100'>
            <TopHeader/>
            <AlertHeader/>
            <Nav.Container>
                <Nav.Row>
                    <Nav.Column className='py-3 text-left'>
                        <h1 className='mt-3 appTitle'>{t('content:pageTitle')}</h1>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row>
                    <Nav.Column className='py-3 text-left'>
                        {this.props.children}
                    </Nav.Column>
                </Nav.Row>
            </Nav.Container>
        </div>
    }
}

TopContainer.propTypes = {
    children    : PT.node.isRequired,
    t           : PT.func.isRequired
};

export default translate()(TopContainer);
