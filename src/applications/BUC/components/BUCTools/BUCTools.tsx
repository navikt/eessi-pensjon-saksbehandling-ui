import { getTagList, saveBucsInfo } from 'actions/buc'
import {dateSorter, sedFilter} from 'applications/BUC/components/BUCUtils/BUCUtils'
import P5000 from 'applications/P5000/P5000'
import P4000 from "applications/P4000/P4000";
import { ChevronRightIcon } from '@navikt/aksel-icons'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { AllowedLocaleString, BUCMode, Loading } from 'declarations/app.d'
import {
  Buc,
  BucInfo,
  BucsInfo,
  Sed,
  Tag,
  TagRawList,
  Tags,
  ValidBuc
} from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Detail, BodyLong, Heading, Button, Panel, Textarea, Tabs } from '@navikt/ds-react'
import {
  slideInFromRight,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'

import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { P5000sFromRinaMap } from 'declarations/p5000'

const BUCToolsPanel = styled(Panel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight(20)} 0.3s forwards;
  &.loading {
    background-color: rgba(128,128,128,0.2);
  }
`
const FlexDiv = styled.div`
  display: flex;
`
const P5000Div = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const P4000Div = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

export const TextArea = styled(Textarea)`
  min-height: 150px;
  width: 100%;
`

export interface BUCToolsProps {
  aktoerId: string
  buc: Buc
  bucInfo?: BucInfo
  className?: string
  initialTab?: string
  onTagChange?: (tagList: Tags) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface BUCToolsSelector {
  bucsInfo?: BucsInfo | undefined
  loading: Loading
  locale: AllowedLocaleString
  p5000sFromRinaMap: P5000sFromRinaMap
  tagList?: TagRawList | undefined
}

const mapState = (state: State): BUCToolsSelector => ({
  bucsInfo: state.buc.bucsInfo,
  loading: state.loading,
  locale: state.ui.locale,
  p5000sFromRinaMap: state.buc.p5000sFromRinaMap,
  tagList: state.buc.tagList
})

const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId,
  buc,
  bucInfo,
  initialTab = 'P5000',
  onTagChange,
  setMode
}: BUCToolsProps): JSX.Element => {
  const {
    bucsInfo, loading, tagList
  }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_activeTab, setActiveTab] = useState<string>(initialTab)
  const [_allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [_tags, setTags] = useState<Tags | undefined>(undefined)

  const onTagsChange = (tagsList: unknown): void => {
    if (tagsList) {
      if (_.isFunction(onTagChange)) {
        onTagChange(tagsList as Tags)
      }
      standardLogger('buc.view.tools.tags.select', { tags: (tagsList as Tags)?.map(t => t.label) || [] })
      setTags(tagsList as Tags)
      dispatch(saveBucsInfo({
        bucsInfo: bucsInfo!,
        aktoerId,
        tags: (tagsList as Tags)?.map((tag: Tag) => tag.value) ?? [],
        buc: buc as ValidBuc
      }))
    }
  }

  const onGettingP5000Click = (e: React.MouseEvent): void => {
    buttonLogger(e)
    setMode('p5000', 'forward', undefined, (
      <P5000
        buc={buc}
        setMode={setMode}
      />
    ))
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const onGettingP4000Click = (e: React.MouseEvent): void => {
    buttonLogger(e)
    setMode('p4000', 'forward', undefined, (
      <P4000
        buc={buc}
        P4000={sortedP4000s && sortedP4000s.length > 0 ? sortedP4000s[0] : undefined}
        setMode={setMode}
      />
    ))
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const tabs = [
    {
      label: t('buc:form-labelP5000'),
      key: 'P5000'
    }, {
      label: t('buc:form-labelP4000'),
      key: 'P4000'
    }, {
      label: t('ui:tags'),
      key: 'tags'
    }
  ]

  const P4000s = buc?.seds?.filter((sed: Sed) => sed.type === 'P4000' && sed.status === 'received')
  const sortedP4000s = P4000s?.sort(dateSorter)
  const hasP5000s = (): boolean => (!_.isEmpty(buc?.seds?.filter(sedFilter).filter(sed => sed.type === 'P5000' && sed.status !== 'cancelled')))
  const hasP4000s = (): boolean => (!_.isEmpty(sortedP4000s))

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading, tagList])

  useEffect(() => {
    if (!_allTags && tagList) {
      setAllTags(tagList.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [t, _allTags, tagList])

  useEffect(() => {
    if (bucInfo && bucInfo.tags && _tags === undefined) {
      setTags(bucInfo.tags.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [bucInfo, t, _tags])

  return (

    <BUCToolsPanel
      border
      data-testid='a_buc_c_buctools--panel-id'
    >

      <Tabs
        data-testid='a_buc_c_buctools--tabs-id'
        onChange={setActiveTab}
        size='medium'
        defaultValue={_activeTab}
      >
        <Tabs.List>
          {tabs.map(tab => {
            return (<Tabs.Tab key={tab.key} label={tab.label} value={tab.key} />)
          })}
        </Tabs.List>
        <Tabs.Panel value='P5000'>
          <P5000Div>
            <Heading size='small'>
              {t('buc:form-titleP5000')}
            </Heading>
            <VerticalSeparatorDiv />
            <FlexDiv>
              <Button
                variant='secondary'
                data-amplitude='buc.view.tools.P5000.view'
                data-testid='a_buc_c_buctools--P5000-button-id'
                disabled={!hasP5000s()}
                onClick={onGettingP5000Click}
                iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
              >
                {t('buc:form-seeP5000s')}
              </Button>
            </FlexDiv>
          </P5000Div>
        </Tabs.Panel>
        <Tabs.Panel value='P4000'>
          <P4000Div>
            <p>{t('buc:form-descriptionP4000')}</p>
            <VerticalSeparatorDiv />
            <FlexDiv>
              <Button
                variant='secondary'
                data-amplitude='buc.view.tools.P4000.view'
                data-testid='a_buc_c_buctools--P4000-button-id'
                disabled={!hasP4000s()}
                onClick={onGettingP4000Click}
                iconPosition="right" icon={<ChevronRightIcon aria-hidden />}
              >
                {t('buc:form-seeP4000s')}
              </Button>
            </FlexDiv>
          </P4000Div>
        </Tabs.Panel>
        <Tabs.Panel value='tags'>
          <VerticalSeparatorDiv size='0.5' />
          <BodyLong>
            {t('buc:form-tagsForBUC-description')}
          </BodyLong>
          <VerticalSeparatorDiv size='0.5' />
          {_tags && !_.isEmpty(_tags) && (
            <>
              <dt>
                <Detail>
                  {t('buc:form-tagsForBUC')}:
                </Detail>
              </dt>
              <dd>
                <BodyLong>
                  {_tags.map((tag: Tag) => tag.label).join(', ')}
                </BodyLong>
              </dd>
            </>
          )}
          <VerticalSeparatorDiv size='0.5' />
          <MultipleSelect<Tag>
            ariaLabel={t('buc:form-tagsForBUC')}
            id='a_buc_c_buctools--tags-select-id'
            aria-describedby='help-tags'
            data-testid='a_buc_c_buctools--tags-select-id'
            hideSelectedOptions={false}
            onSelect={onTagsChange}
            options={_allTags}
            label={t('buc:form-tagsForBUC')}
            values={_tags || []}
          />
        </Tabs.Panel>
      </Tabs>
    </BUCToolsPanel>
  )
}

BUCTools.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  className: PT.string,
  initialTab: PT.string,
  onTagChange: PT.func
}

export default BUCTools
