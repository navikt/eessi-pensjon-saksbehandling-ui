import React from 'react';
import uuidv4 from 'uuid/v4';
import getError from './shared/getError';
import * as Nav from '../ui/Nav';

const errorMessages = {
    userEmail: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    userPhone: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'}
}

export class Contact extends React.Component{
    constructor(props){
        super(props);
        let uuid = uuidv4();
        let nameToId = Object.keys(this.props.contact).reduce((acc, cur, i)=>({...acc, [cur]: uuid+'_'+i }) , {});
        let idToName = Object.keys(this.props.contact).reduce((acc, cur)=>({...acc, [nameToId[cur]]: cur }) , {});
        let inputStates = Object.keys(this.props.contact).reduce((acc, cur)=> ({...acc, [cur]: {
            showError: false,
            error: null,
            errorType: null,
            action: this.props.action.bind(null, cur)
        }}), {});
        this.state = {
            ref: React.createRef(),
            idToName,
            nameToId,
            inputStates,
        };
    }

    onInvalid(event){
        if(event && event.target && event.target.id){
            let id = event.target.id;
            let name = this.state.idToName[id];
            let validity = event.target.validity;
            let inputStates = this.state.inputStates;
            let input = inputStates[name];
            let error = getError(validity);
            this.setState(
                (prevState, props)=>
                {
                    return {
                        inputStates: {
                            ...prevState.inputStates,
                            [name]: {
                                ...prevState.inputStates[name],
                                errorType: error,
                                error: {
                                    feilmelding: errorMessages[name][error] || ''
                                },
                                showError: true
                            }
                        }
                    }
                },
            )
        }
    }


    onChangeHandler(event){
        if(event && event.target && event.target.id){
            let id = event.target.id;
            let name = this.state.idToName[id];
            let validity = event.target.validity;
            let inputStates = this.state.inputStates;
            let input = inputStates[name];
            if(validity.valid){
                this.setState({
                    inputStates: {...inputStates, [name]: {...input, showError: false, error: null, errorType: null}}
                });
            }else if(input.showError && validity[input.errorType] === false){
                let error = getError(validity);
                this.setState({
                    inputStates: {...inputStates, [name]: {
                        ...input,
                        error: {
                            feilmelding: errorMessages[name][error] || ''
                        },
                        errorType: error}}
                })
            }
            input.action(event)
        }
    }

    render(){
        const {t, contact} = this.props;
        const nameToId = this.state.nameToId;
        const idToName = this.state.idToName;
        const inputStates = this.state.inputStates;
        return(
            <div className='mt-3'>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-userEmail') + ' *'} defaultValue={contact.userEmail || ''}
                            onChange={this.onChangeHandler.bind(this)} required="true" type="email"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['userEmail']}
                            feil={inputStates['userEmail'].showError? inputStates['userEmail'].error: null}
                        />

                        <Nav.Input label={t('pinfo:form-userPhone') + ' *'} defaultValue={contact.userPhone || ''}
                            onChange={this.onChangeHandler.bind(this)} required="true" type="tel" pattern=".*\d.*"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['userPhone']}
                            feil={inputStates['userPhone'].showError? inputStates['userPhone'].error: null}
                        />
                    </div>
                </Nav.Row>
            </div>
        );
    }
}

export default Contact;
