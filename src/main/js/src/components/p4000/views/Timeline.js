import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import Timeline from 'react-visjs-timeline';
import './custom-timeline.css';

import * as Nav from '../..//ui/Nav';
import Icons from '../../ui/Icons';
import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const styles = {
    timelineView: {
        backgroundColor: 'whitesmoke',
        borderRadius: '20px'
    }
};

class ThisTimeline extends Component {

 renderDate(date) {
        return date ? date.toDateString() : 'unknown';
    }

    render() {

        const { t, events } = this.props;

        return <Nav.Row className='row-timeline-view' style={styles.timelineView}>
            <Nav.Column>
                <h3>{t('p4000:timeline')}</h3>
                <Timeline options={{
                     width: '100%',
                     height: '50vh',
                     orientation: 'top',
                     showTooltips: true
                }}
                items = {[
                    {
                        id: 1,
                        type: 'range',
                        start: new Date(1970, 1, 1),
                        end: new Date(1980, 1, 1),
                        content: renderToString(<div><Icons kind='work'/>Item A</div>),
                        title: 'this is a tooltip'
                     }, {
                        id: 2,
                        type: 'range',
                        start: new Date(1975, 1, 1),
                        end: new Date(1985, 1, 1),
                        content: 'Item B'
                     }
                ]}
                animation={{
                    duration: 3000,
                    easingFunction: 'easeInQuint'
                }}
                />
            </Nav.Column>
        </Nav.Row>
    }
}

ThisTimeline.propTypes = {
    t : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ThisTimeline)
);
