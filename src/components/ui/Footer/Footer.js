import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import './Footer.css';

const mapStateToProps = (state) => {
    return {
         rinaId   : state.status.rinaId,
         sakId    : state.status.sakId,
         aktoerId : state.status.aktoerId,
         vedtakId : state.status.vedtakId,
         kravId   : state.status.kravId
    }
};

class Footer extends Component {

    render () {

        let { t, rinaId, sakId, aktoerId, vedtakId, kravId } = this.props;

        return <footer className="c-ui-footer">
            {rinaId ? <div><span>rinaId:</span>{rinaId}</div> : null}
            {sakId ? <div><span>sakId:</span>{sakId}</div> : null}
            {aktoerId ? <div><span>aktoerId:</span>{aktoerId}</div> : null}
            {vedtakId ? <div><span>vedtakId:</span>{vedtakId}</div> : null}
            {kravId ? <div><span>kravId:</span>{kravId}</div> : null}
        </footer>
    }
}

Footer.propTypes = {
    t        : PT.func.isRequired,
    rinaId   : PT.string,
    sakId    : PT.string,
    aktoerId : PT.string,
    vedtakId : PT.string,
    kravId   : PT.string
};

export default connect(
    mapStateToProps
)(
    translate()(Footer)
);
