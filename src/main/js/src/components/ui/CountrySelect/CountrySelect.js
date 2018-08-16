import React, {Component} from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import './react-select.min.css'
import { countries } from './CountrySelectData'
import _ from 'lodash';

class CountrySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flagImagePath : '../../../../../flags/',
            imageStyle: {
                width: 30,
                height: 15
            },
            tag: null
        };
        this.logChange = this.logChange.bind(this);
        this.CountryRenderValue = this.CountryRenderValue.bind(this);
        this.CountryOptionRenderer = this.CountryOptionRenderer.bind(this);
    }

    logChange(val) {
        this.setState({tag: val});
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val);
        }
    }

    CountryOptionRenderer(option) {
        const flagImageUrl = this.state.flagImagePath + option.value + '.png';
        const optionStyle = {
            width: 50,
            height: 30
        };
        return (
            <span style={{
                color: option.color
            }}>
                <img src={flagImageUrl} alt={option.label} style={optionStyle}/>&nbsp; {option.label}
            </span>
        )
    }

    CountryRenderValue(option) {
        const flagImageUrl = this.state.flagImagePath + option.value + '.png';
        if (option.value === undefined) {
            return null;
        } else {
            return (
                <span>
                    <img src={flagImageUrl} style={this.state.imageStyle} alt={option.label} onError={this.onImageError}/>&nbsp; {option.label}
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

        const { t, value, locale, list } = this.props;

        let options = list ? this.filter(list, countries[locale]) : countries[locale];

        return <div>
            <Select placeholder={t('ui:searchCountry')}
                value={this.state.tag || value}
                options={options}
                optionRenderer={this.CountryOptionRenderer}
                backspaceRemoves={true}
                onChange={this.logChange}
                valueRenderer={this.CountryRenderValue}
                multi={false}/>
        </div>;
    }
}

CountrySelect.propTypes = {
    onSelect       : PT.func.isRequired,
    value          : PT.object,
    t              : PT.func.isRequired,
    locale         : PT.string.isRequired,
    list           : PT.array
}

export default translate()(CountrySelect);
