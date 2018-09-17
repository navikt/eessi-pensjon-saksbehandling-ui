import React, {Component} from 'react';

export default class CountryValue extends Component {

    render () {

        const { selectProps, data, innerProps } = this.props;
        const flagImageUrl = selectProps.selectProps.flagImagePath + data.value + '.png';
        const _type = selectProps.selectProps.type || 'country';
        const _label = _type === 'country' ? data.label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel;

        return  <div {...innerProps}>
            <img src={flagImageUrl} alt={data.label}
            style={{
                width: 50,
                height: 30
            }}/>&nbsp; {_label}
        </div>
    }
}
