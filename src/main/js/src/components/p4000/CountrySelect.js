import React, {Component, PropTypes as t} from 'react'
import {render} from 'react-dom'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {countries} from './CountrySelectData'

export default class ReactCountrySelect extends Component {

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
                <img src={flagImageUrl} style={optionStyle}/>&nbsp; {option.label}
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
                    <img src={flagImageUrl} style={this.state.imageStyle} alt="" onError={this.onImageError}/>&nbsp; {option.label}
                </span>
            )
        }
    }

    render() {
        return (
            <div>
                <Select placeholder="Search country.."
                value={this.state.tag || this.props.value}
                options={countries}
                optionRenderer={this.CountryOptionRenderer}
                backspaceRemoves={true}
                onChange={this.logChange}
                valueRenderer={this.CountryRenderValue}
                multi={this.props.multi}/>
            </div>
        );
    }
}
