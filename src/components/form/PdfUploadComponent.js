import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as Nav from '../ui/Nav';
import CheckboxesWithValidation from './CheckboxesWithValidation';
import FileUpload from '../ui/FileUpload/FileUpload';
import getError from './shared/getError';

import * as appActions from '../../actions/app';

const mapStateToProps = () => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions), dispatch)};
};

const errorMessages = {
    FileUpload: {valueMissing: 'Vennligst last opp et eller flere dokument(er).'},
    Checkboxes: {valueMissing: 'Vennligst velg type(r) dokumenter som er lastet opp.'}
}

class PdfUploadComponent extends React.Component {

    constructor(props){
        super(props);
        let activeCheckbox = this.oneOrMoreChecked(this.props.checkboxes);
        let activeFileUpload = (this.props.files.length > 0? true: false);
        this.state = {
            Checkboxes: {active: activeCheckbox, showError: false, error: null, errorMessage: null},
            FileUpload: {active: activeFileUpload, showError: false, error: null, errorMessage: null},
            valid: activeCheckbox === activeFileUpload,
        };
        this.validate = this.validate.bind(this);
    }

    oneOrMoreChecked(checkboxes){
        return checkboxes.reduce((acc, cur)=>(acc||cur.inputProps.defaultChecked), false);
    }

    validate(){
        let valid = this.state.Checkboxes.active === this.state.FileUpload.active;
        if(valid){
            this.setState({
                Checkboxes: { ...this.state.Checkboxes, error: null, errorMessage: null},
                FileUpload: { ...this.state.FileUpload, error: null, errorMessage: null},
                valid: valid
            })
        }else{
            this.setState({valid: valid}
            )}
    }

    componentDidMount() {

        const { actions } = this.props;

        this.setState({
            validate: this.validate
        });
        actions.registerDroppable('pdfUploadComponent', this.fileUpload);
    }

    componentWillUnmount() {

        const { actions } = this.props;

        actions.unregisterDroppable('pdfUploadComponent');
    }

    onInvalid(child, event){
        let validityState = event.target.validity;
        let error = getError(validityState);
        let errorMessage = errorMessages[child][error] || '';
        this.setState({
            [child]: {...this.state[child], showError: true, error: error, errorMessage: errorMessage}
        });
    }

    active(child){
        this.setState(
            {
                [child]: {...this.state[child], active: true}
            },
            this.validate
        )
    }

    inactive(child){
        this.setState(
            {
                [child]: {...this.state[child], active: false}
            },
            this.validate
        )
    }

    render(){
        let requiredCheckbox = this.state.FileUpload.active && !this.state.Checkboxes.active;
        let requiredFileUpload = this.state.Checkboxes.active;
        let checkboxError = this.state.Checkboxes.error? {feil: {feilmelding: this.state.Checkboxes.errorMessage}}: null;
        let fileUploadError = this.state.FileUpload.error? {feil: {feilmelding: this.state.FileUpload.errorMessage}}: null;
        return <Nav.SkjemaGruppe>
            <Nav.Row>
                <div className='col-md-6'>
                    <CheckboxesWithValidation legend={this.props.t('pinfo:form-attachmentTypes')}
                        checkboxes={this.props.checkboxes.map(e=>(
                            {
                                ...e,
                                inputProps: {
                                    ...e.inputProps,
                                    required: requiredCheckbox,
                                    onInvalid: this.onInvalid.bind(this, 'Checkboxes')
                                }
                            }
                        ))}
                        active = {this.active.bind(this, 'Checkboxes')}
                        inactive = {this.inactive.bind(this, 'Checkboxes')}
                        action = {this.props.checkboxAction}
                        {...checkboxError}
                    />
                </div>
            </Nav.Row>
            <Nav.SkjemaGruppe {...fileUploadError}>
                <FileUpload ref={f => this.fileUpload = f}
                    fileUploadDroppableId={'pdfUploadComponent'}
                    files={this.props.files || []}
                    active = {this.active.bind(this, 'FileUpload')}
                    inactive = {this.inactive.bind(this, 'FileUpload')}
                    inputProps = {{
                        required: requiredFileUpload,
                        onInvalid: this.onInvalid.bind(this, 'FileUpload')
                    }}
                    action = {this.props.fileUploadAction}
                />
            </Nav.SkjemaGruppe>
        </Nav.SkjemaGruppe>
    }
}

PdfUploadComponent.propTypes = {
    checkboxes       : PT.array,
    files            : PT.array,
    checkboxAction   : PT.func,
    fileUploadAction : PT.func,
    t                : PT.func
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PdfUploadComponent);
