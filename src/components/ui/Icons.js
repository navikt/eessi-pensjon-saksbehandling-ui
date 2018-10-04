import React, { Component } from 'react';
import PT from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

class Icons extends Component {

    render () {

        const { kind } = this.props;

        switch (kind) {

        case 'work' : return <FontAwesomeIcon icon={icons.faBriefcase} {...this.props}/>;
        case 'home' : return <FontAwesomeIcon icon={icons.faHome} {...this.props}/>;
        case 'child' : return <FontAwesomeIcon icon={icons.faChild} {...this.props}/>;
        case 'voluntary' : return <FontAwesomeIcon icon={icons.faHandsHelping} {...this.props}/>;
        case 'military' : return <FontAwesomeIcon icon={icons.faFighterJet} {...this.props}/>;
        case 'birth' : return <FontAwesomeIcon icon={icons.faChild} {...this.props}/>;
        case 'learn' : return <FontAwesomeIcon icon={icons.faSchool} {...this.props}/>;
        case 'daily' : return <FontAwesomeIcon icon={icons.faMoneyBillWave} {...this.props}/>;
        case 'sick' : return <FontAwesomeIcon icon={icons.faHSquare} {...this.props}/>;
        case 'other' : return <FontAwesomeIcon icon={icons.faCalendar} {...this.props}/>;

        case 'document' : return <FontAwesomeIcon icon={icons.faFile} {...this.props}/>;
        case 'view' : return <FontAwesomeIcon icon={icons.faEye} {...this.props}/>;
        case 'calendar' : return <FontAwesomeIcon icon={icons.faCalendarCheck} {...this.props}/>;

        case 'file' :  return <FontAwesomeIcon icon={icons.faFile} {...this.props}/>;
        case 'folder' :  return <FontAwesomeIcon icon={icons.faFolderOpen} {...this.props}/>;
        case 'file-save' :  return <FontAwesomeIcon icon={icons.faSave} {...this.props}/>;
        case 'file-submit' :  return <FontAwesomeIcon icon={icons.faUpload} {...this.props}/>;
        case 'menu' :  return <FontAwesomeIcon icon={icons.faBars} {...this.props}/>;

        case 'clip' :  return <FontAwesomeIcon icon={icons.faPaperclip} {...this.props}/>;
        case 'plus' :  return <FontAwesomeIcon icon={icons.faPlus} {...this.props}/>;
        case 'download' :  return <FontAwesomeIcon icon={icons.faDownload} {...this.props}/>;
        case 'upload' :  return <FontAwesomeIcon icon={icons.faUpload} {...this.props}/>;
        case 'caretLeft' :  return <FontAwesomeIcon icon={icons.faCaretLeft} {...this.props}/>;
        case 'caretRight' :  return <FontAwesomeIcon icon={icons.faCaretRight} {...this.props}/>;
        case 'server' :  return <FontAwesomeIcon icon={icons.faServer} {...this.props}/>;
        case 'close' : return <FontAwesomeIcon icon={icons.faTimesCircle} {...this.props}/>;
        default: return null;
        }
    }
}

Icons.propTypes = {
    kind: PT.string.isRequired
};

export default Icons;
