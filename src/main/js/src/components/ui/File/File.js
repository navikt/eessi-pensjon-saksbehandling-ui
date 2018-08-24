import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import MiniatureOther from './MiniatureOther';
import MiniaturePDF from './MiniaturePDF';

import './File.css';

const units = ['bytes', 'KB', 'MB', 'GB'];

class File extends Component {

    renderBytes(bytes) {

        let level = 0;
        while(bytes >= 1024 && ++level) {
            bytes = bytes/1024;
        }
        return bytes.toFixed(bytes >= 10 || level < 1 ? 0 : 1) + ' ' + units[level];
    }

    render () {

        const { file } = this.props;

        if (_.endsWith(file.name, '.pdf')) {
            return <MiniaturePDF size={this.renderBytes(file.size)} {...this.props}/>
        } else {
            return <MiniatureOther size={this.renderBytes(file.size)} {...this.props}/>
        }
    }
}

File.propTypes = {
    file : PT.object.isRequired
}

export default File;
