import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import './Case.css';

class Case extends Component {

    render() {

        const { t, children, title, description, stepIndicator, className, history, location } = this.props;

        return <TopContainer className={classNames('case','topContainer', className)} history={history} location={location}>
            <h1 className='appTitle'>{t(title)}</h1>
            { description ? <h4 className='appDescription'>{t(description)}</h4> : null }
            <ClientAlert permanent={true}/>
            { stepIndicator !== undefined ? <Nav.Stegindikator
                visLabel={true}
                onBeforeChange={() => {return false}}
                autoResponsiv={true}
                steg={[
                    {label: t('case:form-step1'), aktiv: (stepIndicator === 0)},
                    {label: t('case:form-step2'), aktiv: (stepIndicator === 1)},
                    {label: t('case:form-step3'), aktiv: (stepIndicator === 2)},
                    {label: t('case:form-step4'), aktiv: (stepIndicator === 3)},
                    {label: t('case:form-step5'), aktiv: (stepIndicator === 4)}
                ]}/> : null }
            {children}
        </TopContainer>
    }
}

Case.propTypes = {
    title         : PT.string.isRequired,
    description   : PT.string,
    stepIndicator : PT.number,
    history       : PT.object.isRequired,
    t             : PT.func,
    className     : PT.string,
    children      : PT.oneOfType([PT.array, PT.object]).isRequired,
    location      : PT.object.isRequired
};

export default translate()(Case)
