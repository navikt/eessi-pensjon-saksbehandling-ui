import React, {Component} from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import { countries } from './CountrySelectData'
import _ from 'lodash';
import classNames from 'classnames';
import CountryOption from './CountryOption';
import CountryValue from './CountryValue';

class CountrySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: this.props.value || null,
            selectRef: React.createRef()
        };
    }

    onChange(val) {
        this.setState({tag: val});
        if(this.state.selectRef){
            console.log(this.state.selectRef.current);
        }

        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val);
        }
    }

    filter(selectedCountries, allCountries) {
        return _.filter(allCountries, country => {
            return selectedCountries.indexOf(country.value) >= 0
        });
    }

    render() {

        const { t, value, locale, type, list, className, style } = this.props;

        let optionList = countries[locale];
        let options = (list ? this.filter(list, optionList) : optionList);

        let defValue = this.state.tag || value;
        if (defValue && !defValue.label) {
            defValue = _.find(options, {value: defValue.value});
        }
        return <div className={classNames(className)}>
            <Select placeholder={t('ui:searchCountry')}
                value={defValue}
                options={options}
                required={this.props.required}
                id={this.props.id}
                inputProps={
                    {
                        ...this.props.inputProps,
                        Ref: this.state.selectRef           
                    }}
                components={{Option: CountryOption, SingleValue: CountryValue}}
                selectProps={{
                    type: type,
                    flagImagePath : '../../../../../flags/'
                }}
                onChange={this.onChange.bind(this)}
                style={{...style}}
                multi={false}
                />
        </div>;
    }
}
CountrySelect.propTypes = {
    onSelect  : PT.func.isRequired,
    value     : PT.object,
    t         : PT.func.isRequired,
    locale    : PT.string.isRequired,
    style     : PT.object,
    list      : PT.array,
    type      : PT.string,
    className : PT.string,
    required  : PT.string,
    id        : PT.string,
    inputProps: PT.object
}

export default translate()(CountrySelect);
