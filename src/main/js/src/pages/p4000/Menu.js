import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Icons from '../../components/ui/Icons';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';

const styles = {
    button: {
        width: '200px',
        height: '200px'
    }
}

class Menu extends Component {

    handleNew() {

        const { history } = this.props;
        history.push('/react/p4000/form');
    }

    handleResume() {
        const { history } = this.props;
        history.push('/react/p4000/form');
    }

    render() {

        const { t } = this.props;

        return <TopContainer>
            <Nav.Panel className='h-100'>
                <Nav.Row className='text-center'>
                    <Nav.Column>
                        <Nav.Knapp style={styles.button} onClick={this.handleNew.bind(this)}>
                            <div><Icons size='6x' kind='p4000'/></div>
                            <div>{t('content:p4000-createNew')}</div>
                        </Nav.Knapp>
                    </Nav.Column>
                    <Nav.Column>
                        <Nav.Knapp style={styles.button} disabled={true} onClick={this.handleResume.bind(this)}>{t('content:p4000-resume')}</Nav.Knapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

Menu.propTypes = {
    history : PT.object,
    t       : PT.func
};

export default translate()(Menu);
