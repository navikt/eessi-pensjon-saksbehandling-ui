import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import { bindActionCreators }  from 'redux';

import Icons from  '../Icons';

import * as appActions from '../../../actions/app';
import * as uiActions from '../../../actions/ui';
import * as alertActions from '../../../actions/alert';

import './Breadcrumbs.css';

const mapStateToProps = (state) => {
    return {
        breadcrumbs : state.ui.breadcrumbs
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, alertActions, uiActions, appActions), dispatch)};
};

class Breadcrumbs extends Component {

    onBreadcrumbClick (breadcrumb, e) {

        e.preventDefault();

        const { history, actions } = this.props;

        actions.clearData();
        actions.clientClear();
        actions.trimBreadcrumbsTo(breadcrumb);

        history.push(breadcrumb.url);
    }

    render () {

        let { t, className, breadcrumbs } = this.props;

        return <div className={classNames('breadcrumb', className)}>
            {breadcrumbs ? breadcrumbs.map((b, index) => {
                return index === (breadcrumbs.length - 1) ?
                    <div className='_breadcrumb'>{t(b.label)}</div> :
                    <div  className='_breadcrumb'>
                        <a href={'#' + b.ns} title={t(b.label)} onClick={this.onBreadcrumbClick.bind(this, b)}>{t(b.label)}</a>
                        <span className='separator'>
                            <Icons kind='caretRight' size='1x'/>
                        </span>
                    </div>;
            }) : null}
        </div>;
    }
}

Breadcrumbs.propTypes = {
    t           : PT.function,
    breadcrumbs : PT.array,
    actions     : PT.object.isRequired,
    history     : PT.object.isRequired,
    className   : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate()(Breadcrumbs));
