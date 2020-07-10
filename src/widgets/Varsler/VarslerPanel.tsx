import { sendInvite } from 'actions/pinfo'
import { getStorageFile, listStorageFiles } from 'actions/storage'
import LineMessageSent from 'assets/icons/line-version-expanded-email-send-3'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import RefreshButton from 'components/RefreshButton/RefreshButton'
import { HighContrastHovedknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import { Widget } from 'nav-dashboard'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import { ReactComponent as VeilederSVG } from 'assets/images/NavPensjonVeileder.svg'
import styled from 'styled-components'
import TableSorter, { Item } from 'tabell'
import Panel from 'nav-frontend-paneler'
import { Systemtittel } from 'nav-frontend-typografi'
import Veileder from 'nav-frontend-veileder'

const mapState = /* istanbul ignore next */ (state: State) => ({
  aktoerId: state.app.params.aktoerId,
  fileList: state.storage.fileList,
  file: state.storage.file,
  invite: state.pinfo.invite,
  isInvitingPinfo: state.loading.isInvitingPinfo,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType,
  person: state.app.person
})

export interface Varsler {
  tittel: string
  fulltnavn: string
  timestamp: string
}

export type Varslers = {[k: string]: Varsler}

export const VarslerPropType = PT.shape({
  tittel: PT.string.isRequired,
  fulltnavn: PT.string.isRequired,
  timestamp: PT.string.isRequired
})

interface Invite {
  status: string
  message: string
}

export const InvitePropType = PT.shape({
  status: PT.string.isRequired,
  message: PT.string.isRequired
})

export interface VarslerPanelSelector {
  aktoerId: string
  fileList: Array<string> | undefined
  file: any
  invite: Invite | undefined
  isInvitingPinfo: boolean
  sakId: string
  sakType: string | undefined
  person: any
}

export interface VarslerPanelProps {
  highContrast: boolean
  initialFiles?: Varslers
  onUpdate?: (w: Widget) => void
  widget: Widget
}

const WidgetPanel = styled(Panel)`
  border: 1px solid ${({ theme }: any) => theme.navGra60};
`
const Title = styled.div`
  display: flex;
  justify-content: space-between;
`
const Table = styled(TableSorter)`
  width: 100%;
  margin-top: 0,.5rem;
  tr, td {
    padding: 0.5rem;
  }
`
const NoMessage = styled.div`
  padding: 0.5rem;
  font-style: italic;
  text-align: center;
`
const FlexDiv = styled.div`
  display: flex;
`

export const VarslerPanel: React.FC<VarslerPanelProps> = ({
  highContrast, initialFiles = {}, onUpdate, widget
}: VarslerPanelProps) => {
  const { aktoerId, file, fileList, isInvitingPinfo, invite, person, sakId, sakType }: VarslerPanelSelector = useSelector<State, VarslerPanelSelector>(mapState)
  const [isReady, setIsReady] = useState(false)
  const [_fileList, setFileList] = useState<Array<string> | undefined | null>(undefined)
  const [_files, setFiles] = useState<Varslers>(initialFiles)
  const [mounted, setMounted] = useState(false)
  const [hasParams, setHasParams] = useState(false)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onInviteButtonClick = () => {
    dispatch(sendInvite({
      aktoerId: aktoerId,
      sakId: sakId
    }))
  }

  const onExpandablePanelChange = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  useEffect(() => {
    if (!mounted) {
      if (aktoerId && sakId && fileList === undefined) {
        dispatch(listStorageFiles({
          userId: aktoerId,
          namespace: 'varsler___' + sakId
        }))
      }
      setHasParams(aktoerId !== undefined && sakId !== undefined)
      setMounted(true)
    }
  }, [aktoerId, dispatch, sakId, fileList, mounted])

  useEffect(() => {
    if (!_.isNil(fileList) && _fileList === undefined) {
      fileList.forEach(file => {
        if (!_.includes(Object.keys(_files), file)) {
          dispatch(getStorageFile({
            userId: aktoerId,
            namespace: 'varsler',
            file: sakId + '___' + file
          }, {
            notification: false
          }))
        }
      })

      setIsReady(_.isEmpty(fileList))
      setFileList(fileList)
    }

    if (!_.isNil(fileList) && file !== undefined && !isReady) {
      const files = _.cloneDeep(_files)
      const key = file.timestamp + '.json'
      if (!Object.prototype.hasOwnProperty.call(files, key)) {
        files[key] = file
        const allFilesDone = Object.keys(files).length === fileList.length
        setFiles(files)
        setIsReady(allFilesDone)
      }
    }
  }, [aktoerId, dispatch, fileList, _fileList, _files, file, isReady, sakId])

  const onRefreshHandle = () => {
    if (aktoerId && sakId) {
      setFileList(undefined)
      setFiles({})
      setIsReady(false)
      dispatch(listStorageFiles({
        userId: aktoerId,
        namespace: 'varsler___' + sakId
      }))
    }
  }

  if (!mounted) {
    return null
  }

  if (mounted && !hasParams) {
    return (
      <WidgetPanel>
        <Systemtittel className='w-varslerPanel__noParams-title pb-3'>{t('ui:widget-overview-notifications')}</Systemtittel>
        <Veileder
          tekst={t('pinfo:error-noParams')}
          posisjon='høyre'
          type='feilmelding'
          fargetema='feilmelding'
        >
          <VeilederSVG />
        </Veileder>
      </WidgetPanel>
    )
  }

  const user = _.get(person, 'aktoer.ident.ident') || '-'

  const items = _files && !_.isEmpty(_files) ? Object.keys(_files)
    .sort((a, b) => _files[b].timestamp.localeCompare(_files[a].timestamp))
    .map((file) => {
      const content = _files[file]
      return {
        key: file,
        type: content.tittel || file,
        sender: content.fulltnavn || t('unknown'),
        date: moment(content.timestamp).toDate()
      }
    }) : []

  return (
    <ExpandingPanel
      collapseProps={{ id: 'w-varslerPanel-id' }}
      className='w-varslerPanel s-border'
      open={!widget.options.collapsed}
      highContrast={highContrast}
      onClick={onExpandablePanelChange}
      heading={<Systemtittel className='pb-3'>{t('ui:widget-overview-notifications')}</Systemtittel>}
    >
      <div className='row'>
        <div className='col-md-4'>
          <div style={{ display: 'none' }}>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div>
          </div>
          <Veileder
            tekst={(
              <>
                {!_.isEmpty(invite)
                  ? <div dangerouslySetInnerHTML={{ __html: t(invite!.message) }} />
                  : <div dangerouslySetInnerHTML={{ __html: t('ui:widget-overview-sendNotification-description', { user: user }) }} />}
              </>
            )}
            type={invite ? (invite.status === 'ERROR' ? 'feilmelding' : 'suksess') : 'normal'}
            fargetema={invite ? (invite.status === 'ERROR' ? 'feilmelding' : 'suksess') : 'normal'}
            posisjon='bunn'
          >
            <VeilederSVG />
          </Veileder>
          <div className='text-center'>
            <VerticalSeparatorDiv />
            <HighContrastHovedknapp
              data-testid='w-varslerPanel__invite-button-id'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={onInviteButtonClick}
            >
              {isInvitingPinfo ? t('ui:sending') : t('ui:widget-overview-sendNotification-button')}
            </HighContrastHovedknapp>
          </div>
        </div>
        <div className='col-md-8'>
          <Title>
            <div />
            <RefreshButton
              className='w-varslerPanel__refresh-button'
              labelRefresh={t('ui:refresh')}
              rotating={!isReady}
              onRefreshClicked={onRefreshHandle}
            />
          </Title>
          {!_.isEmpty(items) ? (
            <Table
              items={items}
              searchable
              selectable={false}
              sortable
              loading={!isReady}
              columns={[
                {
                  id: 'type',
                  label: t('ui:sentDocuments'),
                  type: 'object',
                  needle: /* istanbul ignore next */ (it: Item) => it.toLowerCase(),
                  renderCell: (item: any) => (
                    <FlexDiv>
                      <LineMessageSent />
                      <HorizontalSeparatorDiv />
                      <label>{item.type}</label>
                    </FlexDiv>
                  )
                },
                { id: 'sender', label: t('ui:sender'), type: 'string' },
                { id: 'date', label: t('ui:dateandtime'), type: 'date' }
              ]}
            />
          ) : (
            <NoMessage>
              {t('ui:widget-overview-sendNotification-noMessages')}
            </NoMessage>
          )}
        </div>
      </div>
    </ExpandingPanel>
  )
}

VarslerPanel.propTypes = {
  initialFiles: PT.objectOf(VarslerPropType.isRequired),
  onUpdate: PT.func.isRequired,
  widget: PT.any.isRequired // anyWidgetPropType.isRequired
}

export default VarslerPanel
