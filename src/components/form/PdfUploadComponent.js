import React from 'react';
import * as Nav from '../ui/Nav';
import CheckboxesWithValidation from './CheckboxesWithValidation';
import FileUpload from '../ui/FileUpload/FileUpload';

export default class PdfUploadComponent extends React.Component {
    constructor(props){
        super(props);
        let validCheckbox = this.props.checkboxes.reduce((acc, cur)=>(acc||cur.defaultChecked), false);
        let validFileUpload = (this.props.files.length > 0? true: false);
        this.state = {
            Checkboxes: validCheckbox,
            FileUpload: validFileUpload,
            valid: validCheckbox === validFileUpload,
        };
        this.validate = this.validate.bind(this);
        this.setCustomValidity = this.setValidity.bind(this);
    }

    validate(field, value){
        this.setState({valid: this.state.Checkboxes === this.state.FileUpload},
            () => this.setValidity("fooo"));
    }

    setValidity(error){
        console.log(error);
    }

    componentDidMount() {
        this.setState({
            validate: this.validate
        });
    }

    onInvalid(child){
        this.setState(
            {
                [child]: false
            },
            this.validate
        )
    }

    onValid(child){
        this.setState(
            {
                [child]: true
            },
            this.validate
        )
    }


    render(){
        let requiredCheckbox = this.state.FileUpload && !this.state.Checkboxes;
        let requiredFileUpload = this.state.Checkboxes;
        let error = (requiredCheckbox||requiredFileUpload)? {feil: {feilmelding: this.props.t('SomeError')}}: {}
        return <Nav.SkjemaGruppe {...error}>
                <Nav.Row>
                    <div className='col-md-6'>
                        <CheckboxesWithValidation legend={this.props.t('pinfo:form-attachmentTypes')} 
                            checkboxes={this.props.checkboxes.map(e=>(
                                {
                                    ...e,
                                    inputProps: {
                                        ...e.inputProps,
                                        required: requiredCheckbox,
                                        feil:{feilmelding: "checkbox"}
                                    }
                                }
                            ))}
                            onInvalid = {this.onInvalid.bind(this, 'Checkboxes')}
                            onValid = {this.onValid.bind(this, 'Checkboxes')}
                            action = {this.props.checkboxAction}
                            
                            />
                    </div>
                </Nav.Row><Nav.SkjemaGruppe feil={{feilmelding: "test2"}}>
                <FileUpload files={this.props.files || []} 
                    onInvalid = {this.onInvalid.bind(this, 'FileUpload')}
                    onValid = {this.onValid.bind(this, 'FileUpload')}
                    inputProps = {{required: requiredFileUpload}}
                    action = {this.props.fileUploadAction}
                    />
                    </Nav.SkjemaGruppe>
            </Nav.SkjemaGruppe>
    }
}