import React, {Component} from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import { translate } from 'react-i18next'
//import 'react-select/dist/react-select.css'
import {countries} from './CountrySelectData'

class CountrySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        const flagImageUrl = this.props.flagImagePath + option.value + '.png';
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
        const flagImageUrl = this.props.flagImagePath + option.value + '.png';
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

    render() {

        const { t, value, multi } = this.props;
        return <div>
            <Select placeholder={t('ui:searchCountry')}
                value={this.state.tag || value}
                options={countries}
                optionRenderer={this.CountryOptionRenderer}
                backspaceRemoves={true}
                onChange={this.logChange}
                valueRenderer={this.CountryRenderValue}
                multi={multi}/>
        </div>;
    }
}

CountrySelect.propTypes = {
    onSelect       : PT.func.isRequired,
    flagImageUrl   : PT.string,
    value          : PT.object,
    multi          : PT.bool.isRequired,
    t              : PT.func.isRequired
}

export default translate()(CountrySelect);
