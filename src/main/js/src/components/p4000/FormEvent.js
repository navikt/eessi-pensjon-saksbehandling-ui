import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import * as Nav from '../ui/Nav';
import Icons from '../ui/Icons';

import * as p4000Actions from '../../actions/p4000';

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const styles = {
    eventDiv: {
        borderRadius: '10px',
        border: '1px solid lightgray',
        cursor: 'hand'
    },
    eventDivSelected: {
        borderRadius: '10px',
        border: '1px solid red',
        cursor: 'default',
        backgroundColor: 'lightgray'
    }
}

class FormEvent extends Component {

    editFormEvent(index) {

        const { actions } = this.props;
        actions.editP4000FormEvent({index: index})
    }

    render() {

        const { event, index, selected } = this.props;

       return <div className='d-inline-block mr-3' style={selected ? styles.eventDivSelected : styles.eventDiv}
            onClick={selected ? null : this.editFormEvent.bind(this, index)}
       >
        <Icons kind={event.type}/>
        <div>{event.startDate.year}/{event.startDate.month}</div>
        <div>{event.endDate.year}/{event.endDate.month}</div>
       </div>
    }

}

FormEvent.propTypes = {
    t        : PT.func.isRequired,
    event    : PT.object.isRequired,
    index    : PT.number.isRequired,
    selected : PT.bool.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(FormEvent)
);
