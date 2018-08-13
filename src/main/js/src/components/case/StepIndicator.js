import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../ui/Nav'

class StepIndicator extends Component {

    render () {

        let { t, activeStep } = this.props;

        return <Nav.Stegindikator
            visLabel={true}
            onBeforeChange={() => {return false}}
            autoResponsiv={true}
            steg={[
                {label: t('case:form-step1'), aktiv: (activeStep === 0)},
                {label: t('case:form-step2'), aktiv: (activeStep === 1)},
                {label: t('case:form-step3'), aktiv: (activeStep === 2)},
                {label: t('case:form-step4'), aktiv: (activeStep === 3)}
            ]}/>
    }
}

StepIndicator.propTypes = {
    t          : PT.func.isRequired,
    activeStep : PT.number.isRequired
};

export default translate()(StepIndicator);

