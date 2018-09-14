import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from '../ui/Nav';

export default class CheckboxesWithValidation extends React.Component {
    constructor(props){
        super(props);
        this.state = {checkboxStates: {}};
        this.validate = this.validate.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    validate(){
        let valid = Object.values(this.state.checkboxStates).reduce((acc, cur)=> acc||cur,false);
        if(valid){
            this.props.onValid();
        }else{
            this.props.onInvalid();
        }
    }

    onChange(e){
        this.props.action(e);
        this.setState(
            {
                checkboxStates: {
                    ...this.state.checkboxStates,
                    [e.target.id]: e.target.checked
                }
            },
            this.validate
        );
    }

    render(){
        return <Nav.CheckboksPanelGruppe
            ref = {this.state.child}
            onChange = {this.onChange}
            {...this.props}
        />
    }
}