import React, {Component} from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import './react-select.min.css'
import { countries } from './CountrySelectData'
import _ from 'lodash';
import classNames from 'classnames';

class CountrySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flagImagePath : '../../../../../flags/',
            imageStyle: {
                width: 30,
                height: 20
            },
            tag: this.props.value || null,
            selectRef: React.createRef()
        };
        this.logChange = this.logChange.bind(this);
        this.CountryRenderValue = this.CountryRenderValue.bind(this);
        this.CountryOptionRenderer = this.CountryOptionRenderer.bind(this);
    }

    logChange(val) {
        this.setState({tag: val});
        if(this.state.selectRef){
            console.log(this.state.selectRef.current);
        }

        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val);
        }
    }

    CountryOptionRenderer(option) {
        const flagImageUrl = this.state.flagImagePath + option.value + '.png';

        const _type = this.props.type || 'country';
        const optionStyle = {
            width: 50,
            height: 30
        };

        const label = _type === 'country' ? option.label : (option.currency ? option.currency + ' - ' : '') + option.currencyLabel;
        return (
            <span style={{
                color: option.color
            }}>
                <img src={flagImageUrl} alt={option.label} style={optionStyle}/>&nbsp; {label}
            </span>
        )
    }

    CountryRenderValue(option) {
        const flagImageUrl = this.state.flagImagePath + option.value + '.png';

        const _type = this.props.type || 'country';
        const label = _type === 'country' ? option.label : (option.currency ? option.currency + ' - ' : '') + option.currencyLabel;

        if (option.value === undefined) {
            return null;
        } else {
            return (
                <span>
                    <img src={flagImageUrl} style={this.state.imageStyle} alt={option.label} onError={this.onImageError}/>&nbsp; {label}
                </span>
            )
        }
    }

    filter(selectedCountries, allCountries) {
        return _.filter(allCountries, country => {
            return selectedCountries.indexOf(country.value) >= 0
        });
    }

    render() {

        const { t, value, locale, list, className } = this.props;

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
                optionRenderer={this.CountryOptionRenderer}
                backspaceRemoves={true}
                onChange={this.logChange}
                valueRenderer={this.CountryRenderValue}
                style={{...this.props.style}}
                multi={false}
                required={this.props.required}
                id={this.props.id}
                inputProps={
                    {
                        ...this.props.inputProps,
                        Ref: this.state.selectRef           
                    }}
            />
        </div>;
    }
}
//                
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
