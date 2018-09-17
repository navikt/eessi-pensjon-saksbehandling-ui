import React, {Component} from 'react';

export default class CountryOption extends Component {

    render () {

        const { value, label, selectProps, data, innerProps, isSelected, isFocused } = this.props
        const flagImageUrl = selectProps.selectProps.flagImagePath + value + '.png';
        const _type = selectProps.selectProps.type || 'country';
        const _label = _type === 'country' ? label : (data.currency ? data.currency + ' - ' : '') + data.currencyLabel;
        const divStyle = {
            padding: 5
        };

        if (isSelected) {
            divStyle.backgroundColor = 'lightblue';
        }
        if (isFocused) {
            divStyle.backgroundColor = 'aliceblue';
        }

        return  <div style={divStyle} {...innerProps}>
            <img src={flagImageUrl}
                alt={label}
                style={{
                     width: 50,
                     height: 30
                 }}
                onError={selectProps.selectProps.onImageError}
            />
            &nbsp; {_label}
        </div>
    }
}
