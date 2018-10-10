import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import { Ikon } from '../../../components/ui/Nav';
import Icons from '../../../components/ui/Icons';

import * as pdfActions from '../../../actions/pdf';
import * as uiActions from '../../../actions/ui';

import './PDFPageInDnD.css';

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
             modalContent: <div style={{cursor: 'pointer'}} onClick={this.closePreview.bind(this)}>
                 <Document className='documentPreview' file={{data: pdf.data }}>
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
         newRecipe[dndTarget].push({name: name, pageNumber: pageNumber, type: 'pickPage'});
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

         const { pdf, pageNumber, action, pdfsize, className, style } = this.props;

         let iconFunction, iconKind, iconLink, iconSize;
         if (action === 'add') {
             iconFunction = this.addPageToTargetPdf;
             iconKind = 'vedlegg'
             iconSize = '20';
         } else {
             iconFunction = this.removePageFromTargetPdf;
             iconKind = 'trashcan';
             iconSize = '15';
         }

         if (this.state.isHovering) {
             iconLink = <Ikon style={{cursor: 'pointer'}} size={iconSize} kind={iconKind}/>
         }

         return <div style={style} className={classNames('c-pdf-PDFPageInDnD', className)}
             onMouseEnter={this.onHandleMouseEnter.bind(this)}
             onMouseOver={this.onHandleMouseOver.bind(this)}
             onMouseLeave={this.onHandleMouseLeave.bind(this)}>
             <Document className='document' file={{data: pdf.data}}>
                 <div onClick={iconFunction.bind(this, pdf.name, pageNumber)} className='icon actionIcon'>{iconLink}</div>
                 {this.state.isHovering ? <div className='icon previewIcon' onClick={this.openPreview.bind(this, pdf, pageNumber)}>
                     <Icons style={{cursor: 'pointer'}}
                         size={'20'} kind={'view'}/>
                 </div> : null}
                 <Page className='page'
                     width={100 * pdfsize} height={140 * pdfsize}
                     renderMode='svg' pageNumber={pageNumber}/>
                 <div className='pageNumber'>{pageNumber}</div>
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
    action     : PT.string.isRequired,
    className  : PT.string,
    style      : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFPageInDnD);
