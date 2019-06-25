import React from 'react'
import BUCDetail from './BUCDetail'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('Renders without crashing', () => {

  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo['bucs'][buc.type + '-' + buc.caseId]

  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    locale: 'nb',
    buc: buc,
    bucInfo: bucInfo
  }

  it('Is non-empty and matches snapshot', () => {
    let wrapper = shallow(<BUCDetail {...initialMockProps}/>)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders child components', () => {
    let wrapper = render(<BUCDetail {...initialMockProps}/>)
    console.log(wrapper.find('#a-buc-c-bucdetail__header-id'))
    expect(wrapper.find('#a-buc-c-bucdetail__header-id').html()).toEqual('buc:buc-' + buc.type)
    console.lo
    expect(wrapper.find('.a-buc-c-bucdetail__body')).to.have.lengthOf(1)
    expect(wrapper.exists('.a-buc-c-bucdetail__props')).toEqual(true)
    expect(wrapper.find('#a-buc-c-bucdetail__props-type').render().html()).toEqual(buc.type)

  })

})

/*
      <div className='a-buc-c-bucdetail__body'>
        <dl className='a-buc-c-bucdetail__props'>
          <dt class='odd'>
            <Element>{t('ui:type')}:</Element>
          </dt>
          <dd class='odd' id='a-buc-c-bucdetail__props-type'>
            <Normaltekst>{buc.type}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:caseId')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-caseId'>
            <Normaltekst>{buc.caseId}</Normaltekst>
          </dd>
          <dt class='odd'>
            <Element>{t('ui:aktoerId')}:</Element>
          </dt>
          <dd class='odd' id='a-buc-c-bucdetail__props-aktoerId'>
            <Normaltekst>{buc.aktoerId}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:creator')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-creator'>
            <Normaltekst>{buc.creator.institution} ({buc.creator.country})</Normaltekst>
          </dd>
          <dt class='odd'>
            <Element>{t('ui:created')}:</Element>
          </dt>
          <dd class='odd' id='a-buc-c-bucdetail__props-startDate'>
            <Normaltekst>{buc.startDate}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:lastUpdate')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-lastUpdate'>
            <Normaltekst>{buc.lastUpdate}</Normaltekst>
          </dd>
          <dt class='odd'>
            <Element>{t('ui:type')}:</Element>
          </dt>
          <dd class='odd' id='a-buc-c-bucdetail__props-sakType'>
            <Normaltekst>{buc.sakType || '-'}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:status')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-status'>
            <Normaltekst>{t('ui:' + buc.status)}</Normaltekst>
          </dd>
          <dt class='odd'>
            <Element>{t('ui:tags')}:</Element>
          </dt>
          <dd class='odd' id='a-buc-c-bucdetail__props-tags'>
            <EtikettLiten>{bucInfo && bucInfo.tags ? bucInfo.tags.join(', ') : ''}</EtikettLiten>
          </dd>
          <dt>
            <Element>{t('ui:comment')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-comment'>
            <Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Normaltekst>
          </dd>
        </dl>
        <Undertittel
          id='a-buc-c-bucdetail__institutions-id'
          className='mb-2'>
          {t('buc:form-involvedInstitutions')}:
        </Undertittel>
        {!_.isEmpty(institutionList) ? Object.keys(institutionList).map(landkode => {
          const country = _.find(countries[locale], {value: landkode})
          return <div
            id='a-buc-c-bucdetail__institutions-id'
            className='a-buc-c-bucdetail__institutions'
            key={landkode}>
            <Flag label={country.label} country={landkode} size='M'/>
            <Element className='pr-2 pl-2'>{country.label}: </Element>
            <Normaltekst>{institutionList[landkode].join(', ')}</Normaltekst>
          </div>
        }) : <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>}
      </div>
    </EkspanderbartpanelBase>*/
