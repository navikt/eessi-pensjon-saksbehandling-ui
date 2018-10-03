import React, { Component } from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import MiniatureOther from './MiniatureOther';
import MiniaturePDF from './MiniaturePDF';

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

        const { file, animate, scale } = this.props;

        let _animate = _.isBoolean(animate) ? animate : true;
        let _size = this.renderBytes(file.size);
        let _scale = scale || 1.0;

        if (_.endsWith(file.name, '.pdf')) {
            return <MiniaturePDF animate={_animate} size={_size} scale={_scale} {...this.props}/>
        } else {
            return <MiniatureOther animate={_animate} size={_size} scale={_scale} {...this.props}/>
        }
    }
}

File.propTypes = {
    file    : PT.object.isRequired,
    animate : PT.boolean
}

export default File;
