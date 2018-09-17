import React from 'react';
import uuidv4 from 'uuid/v4';
import * as Nav from '../ui/Nav';
import CountrySelect from '../ui/CountrySelect/CountrySelect';


const errorMessages = {
    bankName: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankAddress: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankCountry: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankBicSwift: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankIban: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankCode: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'}
}


function validityObjectToObject(val){
    let returnObject = {};
    for(var key in val){
        returnObject[key] = val[key];
    }
    return returnObject;
}

function getError(val, name){
    let errorType;
    switch(true){
    case val.customError:
        errorType='customError';
        break;
    case val.valueMissing:
        errorType='valueMissing';
        break;
    case val.patternMismatch:
        errorType='patternMismatch';
        break;
    case val.badInput:
        errorType='badInput';
        break;
    case val.rangeOverflow:
        errorType='rangeOverflow';
        break;
    case val.rangeUnderflow:
        errorType='rangeUnderflow';
        break;
    case val.stepMismatch:
        errorType='stepMismatch';
        break;
    case val.tooLong:
        errorType='tooLong';
        break;
    case val.tooShort:
        errorType='tooShort';
        break;
    case val.typeMismatch:
        errorType='typeMismatch';
        break;
    default:
        errorType='unknownError';        
    }
    if(errorMessages[name]){
        return errorType || null;
    }
    else{
        return null;
    }
}



export class Contact extends React.Component{
    constructor(props){
        super(props);
        let uuid = uuidv4();
        let nameToId = Object.keys(this.props.bank).reduce((acc, cur, i)=>({...acc, [cur]: uuid+'_'+i }) , {});
        let idToName = Object.keys(this.props.bank).reduce((acc, cur)=>({...acc, [nameToId[cur]]: cur }) , {});
        let inputStates = Object.keys(this.props.bank).reduce((acc, cur)=> ({...acc, [cur]: {
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
            let error = getError(validityObjectToObject(validity), name);
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
                                    feilmelding: errorMessages[name][error]
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
                let error = getError(validityObjectToObject(validity), name);
                this.setState({
                    inputStates: {...inputStates, [name]: {
                        ...input,
                        error: {
                            feilmelding: errorMessages[name][error]
                        },
                        errorType: error}}
                })
            }
            input.action(event)
        }
    }

    //react-select does not behave nice when it comes to Events.
    onSelectHandler(name, val){
        let id = this.state.nameToId[name];
        let inputStates = this.state.inputStates;
        let input = inputStates[name];
        if(val !== null){
            this.setState({
                inputStates: {...inputStates, [name]: {...input, showError: false, error: null, errorType: null}}
            });
        }
        input.action(val || {});
    }

    render(){

        
        return(
            <div className='mt-3'>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={props.t('pinfo:form-userEmail') + ' *'} value={props.form.userEmail || ''}
                            onChange={setValue.bind(null, props, 'userEmail')} required="true"/>

                        <Nav.Input label={props.t('pinfo:form-userPhone') + ' *'} value={props.form.userPhone || ''}
                            onChange={setValue.bind(null, props, 'userPhone')} required="true"/>
                    </div>
                </Nav.Row>
            </div>
        );
    }


    render(){
        const {t, bank, action, locale} = this.props;
        const validityCheck = this.validityCheck;
        const nameToId = this.state.nameToId;
        const idToName = this.state.idToName;
        const inputStates = this.state.inputStates;
        return (
            <div className='mt-3' ref={this.state.ref}>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankName') + ' *'} defaultValue={bank.bankName || null}
                            onChange={this.onChangeHandler.bind(this)} required="true"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['bankName']}
                            feil={inputStates['bankName'].showError? inputStates['bankName'].error: null}
                        />

                    </div>
                    <div className='col-md-6'>
                        <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={bank.bankAddress || ''}
                            style={{minHeight:'200px'}}
                            onChange={this.onChangeHandler.bind(this)} required="true"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['bankAddress']}
                            feil={inputStates['bankAddress'].showError? inputStates['bankAddress'].error: null}
                        />
                            
                    </div>
                </Nav.Row>
                <Nav.Row>
                    <div className='col-md-6'>
                        <div className='mb-3' >
                            <label>{t('pinfo:form-bankCountry') + ' *'}</label>
                            <Nav.SkjemaGruppe feil={inputStates['bankCountry'].showError? inputStates['bankCountry'].error: null}>
                                <CountrySelect locale={locale} value={
                                    bank.bankCountry || null}
                                onSelect={this.onSelectHandler.bind(this, 'bankCountry')/*action.bind(null, 'bankCountry')*/} required="true" 
                                inputProps={{
                                    onInvalid: this.onInvalid.bind(this),
                                }}
                                id={this.state.nameToId['bankCountry']}
                                />
                            </ Nav.SkjemaGruppe>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} defaultValue={bank.bankBicSwift || null}
                            required="true"
                            onChange={this.onChangeHandler.bind(this)}
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['bankBicSwift']}
                            feil={inputStates['bankBicSwift'].showError? inputStates['bankBicSwift'].error: null}
                        />
                    </div>
                </Nav.Row>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankIban') + ' *'}
                            defaultValue={bank.bankIban || null}
                            onChange={this.onChangeHandler.bind(this)} required="true"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['bankIban']}
                            feil={inputStates['bankIban'].showError? inputStates['bankIban'].error: null}
                        />
                    </div>
                    <div className='col-md-6'>
                        <Nav.Input
                            label={(t('pinfo:form-bankCode') + ' *')}
                            defaultValue={bank.bankCode || null}
                            onChange={this.onChangeHandler.bind(this)} required="true"
                            onInvalid={this.onInvalid.bind(this)}
                            id={this.state.nameToId['bankCode']}
                            feil={inputStates['bankCode'].showError? inputStates['bankCode'].error: null}
                        />
                    </div>
                </Nav.Row>
            </div>
        );

    }
}

export default Bank;
