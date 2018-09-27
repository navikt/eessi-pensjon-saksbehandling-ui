import React from 'react';
import uuidv4 from 'uuid/v4';
import PT from 'prop-types';

import CountrySelect from '../ui/CountrySelect/CountrySelect'
import {onSelect, onInvalid} from './shared/eventFunctions'
import * as Nav from '../ui/Nav';

const errorMessages = {
    retirementCountry: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'}
}

export class Pension extends React.Component{
    constructor(props){
        super(props);
        this.onInvalid = onInvalid.bind(this, errorMessages);

        let uuid = uuidv4();
        let nameToId = Object.keys(this.props.pension).reduce((acc, cur, i)=>({...acc, [cur]: uuid+'_'+i }) , {});
        let idToName = Object.keys(this.props.pension).reduce((acc, cur)=>({...acc, [nameToId[cur]]: cur }) , {});
        let inputStates = Object.keys(this.props.pension).reduce((acc, cur)=> ({...acc, [cur]: {
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

    render(){
        const {t, locale, pension} = this.props;
        const nameToId = this.state.nameToId;
        const inputStates = this.state.inputStates; 
        return(
            <Nav.Row>
                <div className='col-md-6'>
                    <label>{t('pinfo:form-retirementCountry') + ' *'}</label>
                    <CountrySelect
                        locale={locale}
                        value={pension.retirementCountry || null}
                        onSelect={onSelect.bind(this, 'retirementCountry')}
                        required={true}
                        customInputProps={{
                            required: pension.retirementCountry? false: true,
                            onInvalid: this.onInvalid,
                            id: nameToId['retirementCountry']
                        }}
                        error={inputStates.retirementCountry.showError}  
                        errorMessage={
                            inputStates.retirementCountry.error?
                                inputStates.retirementCountry.error.feilmelding:
                                null
                        }              
                    />
                </div>
            </Nav.Row>
        )
    }
}

Pension.propTypes= {
    pension : PT.object,
    action  : PT.func,
    t       : PT.func,
    locale  : PT.string
}

export default Pension;