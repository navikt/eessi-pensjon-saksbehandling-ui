import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from './Nav'

class StepIndicator extends Component {

    render () {

        let { t, activeStep } = this.props;

        return <Nav.Stegindikator visLabel={true} onBeforeChange={() => {return false}}
            autoResponsiv={true}
            steg={[
                {label: t('ui:step1'), aktiv: (activeStep === 0)},
                {label: t('ui:step2'), aktiv: (activeStep === 1)},
                {label: t('ui:step3'), aktiv: (activeStep === 2)},
                {label: t('ui:step4'), aktiv: (activeStep === 3)}
            ]}/>
    }
}

StepIndicator.propTypes = {
    t          : PT.func.isRequired,
    activeStep : PT.number.isRequired
};

export default translate()(StepIndicator);

