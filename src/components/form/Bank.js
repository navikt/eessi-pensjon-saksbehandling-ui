import React from 'react';
import PT from 'prop-types';
import uuidv4 from 'uuid/v4';

import * as Nav from '../ui/Nav';
import CountrySelect from '../ui/CountrySelect/CountrySelect';
import { onChange, onInvalid, onSelect } from './shared/eventFunctions';

const errorMessages = {
    bankName: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankAddress: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankCountry: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankBicSwift: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankIban: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'},
    bankCode: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing'}
}



export class Bank extends React.Component{
    constructor(props){
        super(props);

        this.onInvalid = onInvalid.bind(this, errorMessages);
        this.onChange = onChange.bind(this, errorMessages);
        this.onSelect = onSelect.bind(this, 'bankCountry');

        let uuid = uuidv4();
        let nameToId = Object.keys(this.props.bank).reduce((acc, cur, i)=>({...acc, [cur]: uuid+'_'+i }) , {});
        let idToName = Object.keys(this.props.bank).reduce((acc, cur)=>({...acc, [nameToId[cur]]: cur }) , {});
        let inputStates = Object.keys(this.props.bank).reduce((acc, cur)=> ({...acc, [cur]: {
            showError: false,
            error: null,
            errorType: null,
            action: this.props.action.bind(null, cur)
        }}), {});
        let countryRequired = this.props.bank.bankCountry? false: true;
        this.state = {
            ref: React.createRef(),
            idToName,
            nameToId,
            inputStates,
            customInputProps : {required: countryRequired, onInvalid: this.onInvalid, id: nameToId['bankCountry']}
        };
    }

    render(){
        const {t, bank, locale} = this.props;
        const nameToId = this.state.nameToId;
        const inputStates = this.state.inputStates;
        return (
            <div className='mt-3' ref={this.state.ref}>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankName') + ' *'} defaultValue={bank.bankName || null}
                            onChange={this.onChange}
                            required={!inputStates.bankName..showError}
                            onInvalid={this.onInvalid}
                            id={nameToId['bankName']}
                            feil={inputStates.bankName.showError? inputStates.bankName.error: null}
                        />

                    </div>
                    <div className='col-md-6'>
                        <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={bank.bankAddress || ''}
                            style={{minHeight:'200px'}}
                            onChange={this.onChange}
                            required={!inputStates.bankAddress.showError}
                            onInvalid={this.onInvalid}
                            id={nameToId['bankAddress']}
                            feil={inputStates.bankAddress.showError? inputStates.bankAddress.error: null}
                        />
                            
                    </div>
                </Nav.Row>
                <Nav.Row>
                    <div className='col-md-6'>
                        <div className='mb-3' >
                            <label>{t('pinfo:form-bankCountry') + ' *'}</label>
                            <div>
                                <CountrySelect locale={locale}
                                    value={bank.bankCountry || null}
                                    onSelect={this.onSelect}
                                    customInputProps={{
                                        required: (bank.bankCountry || inputStates.bankCountry.showError) ? false : true,
                                        onInvalid: this.onInvalid,
                                        id: nameToId.bankCountry
                                    }}
                                    error={inputStates.bankCountry.showError}
                                    errorMessage={
                                        inputStates.bankCountry.error?
                                            inputStates.bankCountry.error.feilmelding:
                                            null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} defaultValue={bank.bankBicSwift || null}
                            required={!inputStates.bankBicSwift.showError}
                            onChange={this.onChange}
                            onInvalid={this.onInvalid}
                            id={nameToId['bankBicSwift']}
                            feil={inputStates.bankBicSwift.showError? inputStates.bankBicSwift.error: null}
                        />
                    </div>
                </Nav.Row>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-bankIban') + ' *'}
                            defaultValue={bank.bankIban || null}
                            onChange={this.onChange}
                            required={!inputStates.bankIban.showError}
                            onInvalid={this.onInvalid}
                            id={nameToId.bankIban}
                            feil={inputStates.bankIban..showError? inputStates.bankIban.error: null}
                        />
                    </div>
                    <div className='col-md-6'>
                        <Nav.Input
                            label={(t('pinfo:form-bankCode') + ' *')}
                            defaultValue={bank.bankCode || null}
                            onChange={this.onChange}
                            required={!inputStates.bankCode.showError}
                            onInvalid={this.onInvalid}
                            id={nameToId.bankCode}
                            feil={inputStates.bankCode.showError? inputStates.bankCode.error: null}
                        />
                    </div>
                </Nav.Row>
            </div>
        );

    }
}

export default Bank;

Bank.propTypes = {
    bank: PT.object,
    action    : PT.func,
    t         : PT.func,
    locale  : PT.string,
}
