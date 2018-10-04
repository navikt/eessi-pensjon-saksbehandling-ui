import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import * as pdfActions from '../../../actions/pdf';

import { Ikon } from '../../ui/Nav';

import './PDFSpecialPage.css';

const mapStateToProps = (state) => {
    return {
        pdfsize   : state.pdf.pdfsize,
        recipe    : state.pdf.recipe,
        dndTarget : state.pdf.dndTarget
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class PDFSpecialPage extends Component {

    state = {
        isHovering : false
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

    onDeleteDocument(title, e) {

        e.stopPropagation();
        e.preventDefault();

        const { recipe, dndTarget, actions } = this.props;
        let newRecipe = _.clone(recipe);

        let index = _.findIndex(recipe[dndTarget], {title: title});
        if (index >= 0) {
            newRecipe[dndTarget].splice(index, 1);
            actions.setRecipe(newRecipe);
        }
    }

    render () {

        const { pdfsize, className, style, title,  deleteLink } = this.props;

        return <div style={style} className={classNames('c-pdf-PDFSpecialPage', className)}
            onMouseEnter={this.onHandleMouseEnter.bind(this)}
            onMouseOver={this.onHandleMouseOver.bind(this)}
            onMouseLeave={this.onHandleMouseLeave.bind(this)}>
            {this.state.isHovering && deleteLink ? <div className='link deleteLink'>
                <Ikon size={15} kind='trashcan' onClick={this.onDeleteDocument.bind(this, title)}/>
            </div> : null}
            <div className='page' style={{width : 100 * pdfsize, height: 140 * pdfsize}}>
                <div className='content'>{title}</div>
            </div>
        </div>
    }
}

PDFSpecialPage.propTypes = {
    recipe     : PT.object.isRequired,
    pdfsize    : PT.number.isRequired,
    className  : PT.string,
    style      : PT.object,
    title      : PT.string,
    dndTarget  : PT.string,
    deleteLink : PT.bool,
    actions    : PT.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PDFSpecialPage);
