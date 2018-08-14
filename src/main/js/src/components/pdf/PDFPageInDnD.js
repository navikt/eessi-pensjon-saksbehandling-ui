import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import _ from 'lodash';

import { Ikon } from '../../components/ui/Nav';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        recipe    : state.pdf.recipe,
        pdfsize   : state.pdf.pdfsize,
        dndTarget : state.pdf.dndTarget,
        pdfs      : state.pdf.pdfs
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch)};
};

class PDFPageInDnD extends Component {

     state = {
         isHovering : false
     }

     closePreview() {

         const { actions } = this.props;

         actions.closeModal();
     }

     openPreview(pdf, pageNumber) {

         const { actions } = this.props;

         actions.openModal({
             content: <div style={{cursor: 'pointer'}} onClick={this.closePreview.bind(this)}>
                 <Document className='document' file={{data: pdf.data }}>
                     <Page className='bigpage' width={600} renderMode='svg' pageNumber={pageNumber}/>
                 </Document>
             </div>
         })
     }

     addPageToTargetPdf(name, pageNumber) {

         let { recipe, dndTarget, actions } = this.props;

         let newRecipe = _.clone(recipe);
         if (!newRecipe[dndTarget]) {
             newRecipe[dndTarget] = [];
         }
         newRecipe[dndTarget].push({name: name, pageNumber: pageNumber});
         actions.setRecipe(newRecipe);
     }

     removePageFromTargetPdf(name, pageNumber) {

         const { recipe, dndTarget, actions } = this.props;
         let newRecipe = _.clone(recipe);

         let index = _.findIndex(recipe[dndTarget], {name: name, pageNumber : pageNumber});
         if (index >= 0) {
             newRecipe[dndTarget].splice(index, 1);
             actions.setRecipe(newRecipe);
         }
     }

     onHandleMouseEnter() {

         this.setState({isHovering : true});
     }

     onHandleMouseOver() {

         this.setState({isHovering : true});
     }

     onHandleMouseLeave() {

         this.setState({isHovering : false});
     }

     render () {

         const { pdf, pageNumber, action, pdfsize } = this.props;

         let iconFunction, iconKind, iconLink;
         if (action === 'add') {
             iconFunction = this.addPageToTargetPdf;
             iconKind = 'vedlegg'
         } else {
             iconFunction = this.removePageFromTargetPdf
             iconKind = 'trashcan';
         }

         if (this.state.isHovering) {
             iconLink = <Ikon style={{cursor: 'pointer'}}
                 size={32} kind={iconKind}
                 onClick={iconFunction.bind(this, pdf.name, pageNumber)}/>
         }

         return <div className='d-inline-block'
             onMouseEnter={this.onHandleMouseEnter.bind(this)}
             onMouseOver={this.onHandleMouseOver.bind(this)}
             onMouseLeave={this.onHandleMouseLeave.bind(this)}>
             <Document className='position-relative' file={{data: pdf.data}}>
                 <div className='position-absolute' style={{zIndex: 10, right: 2, top: 2}}>{iconLink}</div>
                 <div>
                     <Page
                         onClick={this.openPreview.bind(this, pdf, pageNumber)}
                         className='d-inline-block page'
                         width={pdfsize} height={pdfsize * 1.3}
                         renderMode='svg' pageNumber={pageNumber}/>
                 </div>
                 <div className='position-absolute' style={{zIndex: 10, right: 2, bottom: 2}}>{pageNumber}</div>
             </Document>
         </div>
     }
}

PDFPageInDnD.propTypes = {
    recipe     : PT.object.isRequired,
    actions    : PT.object,
    pdf        : PT.object.isRequired,
    pageNumber : PT.number.isRequired,
    pdfsize    : PT.number.isRequired,
    dndTarget  : PT.string,
    action     : PT.string.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFPageInDnD);
