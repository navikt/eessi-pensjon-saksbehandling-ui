import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import MiniatureOther from './MiniatureOther';
import MiniaturePDF from './MiniaturePDF';

import './File.css';

class File extends Component {

    render () {

        const { file, className } = this.props;

        if (_.endsWith(file.name, '.pdf')) {
             return <MiniaturePDF {...this.props}/>
        } else {
             return <MiniatureOther {...this.props}/>
        }
    }
}

File.propTypes = {
    file      : PT.object.isRequired,
    className : PT.string
}

export default File;
