import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

class Icons extends Component {

    render () {

       const { kind, size } = this.props;

       switch (kind) {

            case 'work' : return <FontAwesomeIcon icon={icons.faBriefcase} {...this.props}/>;
            case 'home' : return <FontAwesomeIcon icon={icons.faHome} {...this.props}/>;
            case 'child' : return <FontAwesomeIcon icon={icons.faChild} {...this.props}/>;
            case 'voluntary' : return <FontAwesomeIcon icon={icons.faHandsHelping} {...this.props}/>;
            case 'military' : return <FontAwesomeIcon icon={icons.faFighterJet} {...this.props}/>;
            case 'birth' : return <FontAwesomeIcon icon={icons.faMoneyBillWave} {...this.props}/>;
            case 'learn' : return <FontAwesomeIcon icon={icons.faSchool} {...this.props}/>;
            case 'daily' : return <FontAwesomeIcon icon={icons.faHandHoldingUsd} {...this.props}/>;
            case 'sick' : return <FontAwesomeIcon icon={icons.faHSquare} {...this.props}/>;
            case 'other' : return <FontAwesomeIcon icon={icons.faCalendar} {...this.props}/>;
            default: return null;
       }
       return null;
    }
}

export default Icons;
