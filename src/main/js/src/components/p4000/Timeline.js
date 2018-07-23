import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './custom-timeline.css';

import * as Nav from '../ui/Nav';
import Icons from '../ui/Icons';

import * as p4000Actions from '../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        form: state.p4000.form
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Timeline extends Component {

    render() {

        const { form } = this.props;
        return <VerticalTimeline>
            {(() => {
                return form.map(event => {
                    let dateString = event.startDate.year + '/' + event.startDate.month + ' - ' +  event.endDate.year + '/' + event.endDate.month
                    return (<VerticalTimelineElement
                        date={dateString}
                        iconStyle={{ background: 'rgb(33,150,24)', color: '#fff'}}
                        icon={<Icons size='3x' kind={event.type}/>}
                    >
                     <h3 className='vertical-timeline-element-title'>Title</h3>
                     <h4 className='vertical-timeline-element-subtitle'>SubTitle</h4>
                   </VerticalTimelineElement>);
                });
            })()}
       </VerticalTimeline>
    }

}

Timeline.propTypes = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Timeline)
);
