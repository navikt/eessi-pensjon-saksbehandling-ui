import React from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'

import * as routes from '../../constants/routes'
import { p6000SetEventProperty } from '../../actions/p6000'
import { addToBreadcrumbs } from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    data: state.p6000.data
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setEventProperty: (key, event) => { dispatch(p6000SetEventProperty({ [key]: event.target.value })) },
    addToBreadcrumbs: (payload) => { dispatch(addToBreadcrumbs(payload)) }
  }
}

class P6000 extends React.Component {
  constructor (props) {
    super(props)
    this.setAward = this.props.setEventProperty.bind(null, 'award')
    this.setVoluntary = this.props.setEventProperty.bind(null, 'voluntary')
    this.setCredited = this.props.setEventProperty.bind(null, 'credited')
    this.setReview = this.props.setEventProperty.bind(null, 'review')

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount () {
    this.setState({
      isLoaded: true
    })

    this.props.addToBreadcrumbs({
      url: routes.P6000,
      ns: 'p6000',
      label: 'p6000:app-title'
    })
  }

  render () {
    const { t, data, history, location } = this.props
    return (
      <TopContainer
        className='p-p6000'
        history={history}
        location={location}
      >

        <div className='mt-6'>
          <Nav.Row>
            <div className='col-md-6'>
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

      </TopContainer>
    )
  }
}

P6000.propTypes = {
  data: PT.object

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(P6000))
