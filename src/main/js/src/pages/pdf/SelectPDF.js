import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import FileUpload from '../../components/ui/FileUpload/FileUpload';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.alert.clientErrorMessage,
        errorStatus  : state.alert.clientErrorStatus,
        gettingCase  : state.loading.gettingCase,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

class SelectPDF extends Component {

    state = {}

    componentDidMount() {

        this.setState({
            files: []
        });
    }

    onForwardButtonClick() {

        const {actions} = this.props;

        actions.navigateForward();
        actions.selectPDF(this.state.files);
    }

    componentDidUpdate() {

        const { history, pdfs } = this.props;
        if (!_.isEmpty(pdfs)) {
            history.push('/react/pdf/edit');
        }
    }

    handleFileChange(files) {

        this.setState({
            files: files
        });
    }

    render() {

        const { t, errorMessage, errorStatus, gettingPDF } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingPDF ? t('pdf:loadingGettingPDF') : t('ui:forward');

        return <TopContainer className='topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mt-3 appTitle'>{t('pdf:selectPdfTitle')}</h1>
                </Nav.Column>
            </Nav.Row>
            {alert ? <Nav.Row className='mb-4'>
                <Nav.Column>{alert}</Nav.Column>
            </Nav.Row> : null}
            <Nav.Row className='m-3 p-3 fieldset'>
                <Nav.Column>
                    <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                    <FileUpload accept='application/pdf' className='mb-3' files={this.state.files} onFileChange={this.handleFileChange.bind(this)}/>
                    <Nav.Hovedknapp className='forwardButton' spinner={gettingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

SelectPDF.propTypes = {
    errorMessage : PT.string,
    errorStatus  : PT.string,
    gettingPDF   : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SelectPDF)
);
