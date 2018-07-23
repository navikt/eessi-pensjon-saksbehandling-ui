import React, { Component } from 'react';
import PT from 'prop-types';

import YearMonthSelector from 'react-year-month-selector';
import 'react-year-month-selector/src/styles/index.css';

class DatePicker extends Component {

    state = {}

    onChange(year, month) {

        console.log(year + ' ' +month);
        this.setState({
            year: year,
            month: month
        })
    }

    onFocus () {

        this.setState({open: true});
    }

    onClose (onDatePicked) {

        onDatePicked(this.state.year, this.state.month)
    }


    render () {

        let { onDatePicked } = this.props;

        return <div>
        <input type='text' onFocus={this.onFocus.bind(this)}/>
        <YearMonthSelector onChange={this.onChange.bind(this)}
            open={this.state.open}
            onClose={this.onClose.bind(this, onDatePicked)}
        />
        </div>
    }
}

DatePicker.propTypes = {
    onDatePicked : PT.func.isRequired
};

export default DatePicker;

