import React from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import * as Nav from '../ui/Nav'

import { p6000SetEventProperty } from '../../actions/p6000'

const mapStateToProps = (state) => {
  return {
    data: state.p6000.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEventProperty: (arg) => { dispatch(p6000SetEventProperty(arg)) }
  }
}

function setProperty (key, event) {
  this.props.setEventProperty({ [key]: event.target.value })
}

class P6000 extends React.Component {
  constructor (props) {
    super(props)
    this.setAward = setProperty.bind(this, 'award')
    this.setVoluntary = setProperty.bind(this, 'voluntary')
    this.setCredited = setProperty.bind(this, 'credited')
    this.setReview = setProperty.bind(this, 'review')
  }

  render () {
    const { t, data } = this.props
    return (
      <div className='mt-3'>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.HjelpetekstBase id='help-award'>
              {t('Trenger innspill fra fag om passende hjelpetekster (om noen)')}
            </Nav.HjelpetekstBase>
            <Nav.RadioPanelGruppe
              name='awardBenefit'
              legend={t('p6000:label-award-benefit')}
              radios={[
                { label: t('p6000:select-award-01'), value: '01', id: 'award01' },
                { label: t('p6000:select-award-02'), value: '02', id: 'award02' },
                { label: t('p6000:select-award-03'), value: '03', id: 'award03' },
                { label: t('p6000:select-award-04'), value: '04', id: 'award04' },
                { label: t('p6000:select-award-05'), value: '05', id: 'award05' }
              ]}
              checked={data.award || ''}
              onChange={this.setAward}
            />
          </div>
          <div className='col-md-6'>
            <Nav.HjelpetekstBase id='help-award'>
              {t('Trenger innspill fra fag om passende hjelpetekster (om noen)')}
            </Nav.HjelpetekstBase>
            <Nav.RadioPanelGruppe
              name='voluntaryContributions'
              legend={t('p6000:label-voluntary-contributions')}
              radios={[
                { label: t('p6000:select-voluntary-01'), value: '01', id: 'voluntary01' },
                { label: t('p6000:select-voluntary-02'), value: '02', id: 'voluntary02' },
                { label: t('p6000:select-voluntary-03'), value: '03', id: 'voluntary03' }
              ]}
              checked={data.voluntary || ''}
              onChange={this.setVoluntary}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.HjelpetekstBase id='help-award'>
              {t('Trenger innspill fra fag om passende hjelpetekster (om noen)')}
            </Nav.HjelpetekstBase>
            <Nav.RadioPanelGruppe
              name='creditedPeriod'
              legend={t('p6000:label-credited-period')}
              radios={[
                { label: t('p6000:select-credited-1'), value: '1', id: 'credited1' },
                { label: t('p6000:select-credited-0'), value: '0', id: 'credited0' }
              ]}
              checked={data.credited || ''}
              onChange={this.setCredited}
            />
          </div>
          <div className='col-md-6'>
            <Nav.HjelpetekstBase id='help-award'>
              {t('Trenger innspill fra fag om passende hjelpetekster (om noen)')}
            </Nav.HjelpetekstBase>
            <Nav.RadioPanelGruppe
              name='decisionReview'
              legend={t('p6000:label-review')}
              radios={[
                { label: t('p6000:select-review-1'), value: '1', id: 'review1' },
                { label: t('p6000:select-review-0'), value: '0', id: 'review0' }
              ]}
              checked={data.review || ''}
              onChange={this.setReview}
            />
          </div>
        </Nav.Row>
      </div>
    )
  }
}

P6000.propTypes = {
  data: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(P6000))
