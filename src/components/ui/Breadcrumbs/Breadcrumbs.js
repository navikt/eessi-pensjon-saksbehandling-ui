import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import { bindActionCreators }  from 'redux';

import * as uiActions from '../../../actions/ui';

import * as Nav from '../Nav';
import './Breadcrumbs.css';

const mapStateToProps = (state) => {
    return {
        breadcrumbs : state.ui.breadcrumbs
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};

class Breadcrumbs extends Component {

    onBreadcrumbClick () {

    }

    render () {

        let { t, className, breadcrumbs } = this.props;

        return <div className={classNames('breadcrumbs', className)}>
            {breadcrumbs ? breadcrumbs.map((b, index) => {
                return index === (breadcrumbs.length - 1) ? <div>{t(b.label)}</div> : <div>
                    <a href={b.url} title={t(b.label)}>{t(b.label)}</a>
                    <span className='separator'></span>
                </div>;

            }) : null}
        </div>;
    }
}

Breadcrumbs.propTypes = {
    t           : PT.function,
    breadcrumbs : PT.array,
    actions     : PT.object.isRequired,
    className   : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate()(Breadcrumbs));
