import * as pinfoActions from 'actions/pinfo'
import * as storageActions from 'actions/storage'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { ReactComponent as VeilederSVG } from 'resources/images/NavPensjonVeileder.svg'
import { bindActionCreators, connect } from 'store'
import { ActionCreators, Dispatch, State, T } from 'types.d'
import './VarslerPanel.css'

export interface Varsler {
  tittel: string;
  fulltnavn: string;
  timestamp: string;
}

interface Invite {
  status: string;
  message: string;
}

export interface VarslerPanelProps {
  actions: ActionCreators;
  aktoerId: string;
  file: Varsler | undefined;
  fileList: Array<string> |undefined |null;
  isInvitingPinfo: boolean;
  invite: Invite | undefined;
  onUpdate: Function;
  person: any;
  sakId?: string;
  sakType: string;
  t: T;
  widget: any;
}

const mapStateToProps = /* istanbul ignore next */ (state: State) => {
  return {
    aktoerId: state.app.params.aktoerId,
    fileList: state.storage.fileList,
    file: state.storage.file,
    invite: state.pinfo.invite,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    sakId: state.app.params.sakId,
    sakType: state.app.params.sakType,
    person: state.app.person
  }
}

const mapDispatchToProps = /* istanbul ignore next */ (dispatch: Dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions, ...storageActions }, dispatch) }
}

export const VarslerPanel = ({
  actions, aktoerId, file, fileList, isInvitingPinfo, invite, onUpdate, person, sakId, sakType, t, widget
}: VarslerPanelProps) => {
  const [isReady, setIsReady] = useState(false)
  const [_fileList, setFileList] = useState<Array<string> | undefined | null>(undefined)
  const [_files, setFiles] = useState<{[k: string]: Varsler}>({})
  const [mounted, setMounted] = useState(false)
  const [hasParams, setHasParams] = useState(false)

  const onInviteButtonClick = () => {
    actions.sendInvite({
      aktoerId: aktoerId,
      sakId: sakId
    })
  }

  const onExpandablePanelChange = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  useEffect(() => {
    if (!mounted) {
      if (aktoerId && sakId && fileList === undefined) {
        actions.listStorageFiles({
          userId: aktoerId,
          namespace: 'varsler___' + sakId
        })
      }
      setHasParams(aktoerId !== undefined && sakId !== undefined)
      setMounted(true)
    }
  }, [actions, aktoerId, sakId, fileList, mounted])

  useEffect(() => {
    if (!_.isNil(fileList) && _fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFile({
          userId: aktoerId,
          namespace: 'varsler',
          file: sakId + '___' + file
        }, {
          notification: false
        })
        return file
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
  }, [actions, aktoerId, fileList, _fileList, _files, file, isReady, sakId])

  const onRefreshHandle = () => {
    if (aktoerId && sakId) {
      setFileList(undefined)
      setFiles({})
      setIsReady(false)
      actions.listStorageFiles({
        userId: aktoerId,
        namespace: 'varsler___' + sakId
      })
    }
  }

  if (!mounted) {
    return null
  }

  if (mounted && !hasParams) {
    return (
      <Ui.Nav.Panel className='w-varslerPanel s-border'>
        <Ui.Nav.Systemtittel className='w-varslerPanel__noParams-title pb-3'>{t('ui:widget-overview-notifications')}</Ui.Nav.Systemtittel>
        <Ui.Nav.Veileder
          tekst={t('pinfo:error-noParams')}
          posisjon='høyre'
          type='feilmelding'
          fargetema='feilmelding'
        >
          <VeilederSVG />
        </Ui.Nav.Veileder>
      </Ui.Nav.Panel>
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
    <Ui.Nav.EkspanderbartpanelBase
      className='w-varslerPanel s-border'
      apen={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
      heading={<Ui.Nav.Systemtittel className='pb-3'>{t('ui:widget-overview-notifications')}</Ui.Nav.Systemtittel>}
    >
      <Ui.Nav.Row>
        <div className='col-md-4'>
          <div style={{ display: 'none' }}>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div>
          </div>
          <Ui.Nav.Veileder
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
          </Ui.Nav.Veileder>
          <div className='text-center'>
            <Ui.Nav.Hovedknapp
              id='w-varslerPanel__invite-button-id'
              className='w-varslerPanel__invite-button mt-3'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={onInviteButtonClick}
            >
              {isInvitingPinfo ? t('sending') : t('ui:widget-overview-sendNotification-button')}
            </Ui.Nav.Hovedknapp>
          </div>
        </div>
        <div className='col-md-8'>
          <div className='w-varslerPanel__title'>
            <div />
            <Ui.RefreshButton
              className='w-varslerPanel__refresh-button'
              labelRefresh={t('ui:refresh')}
              rotating={!isReady}
              onRefreshClicked={onRefreshHandle}
            />
          </div>
          {!_.isEmpty(items) ? (
            <Ui.TableSorter
              className='w-varslerPanel__table w-100 mt-2'
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
                  needle: (it: string) => it.toLowerCase(),
                  renderCell: (item: any) => (
                    <div className='d-flex'>
                      <Ui.Icons className='mr-2' kind='nav-message-sent' />
                      <label>{item.type}</label>
                    </div>
                  )
                },
                { id: 'sender', label: t('ui:sender'), type: 'string' },
                { id: 'date', label: t('ui:dateandtime'), type: 'date' }
              ]}
            />
          ) : (
            <div className='p-2 w-varslerPanel__noMessages font-italic'>{t('ui:widget-overview-sendNotification-noMessages')}</div>
          )}
        </div>
      </Ui.Nav.Row>
    </Ui.Nav.EkspanderbartpanelBase>
  )
}

VarslerPanel.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  file: PT.object,
  fileList: PT.array,
  isInvitingPinfo: PT.bool,
  invite: PT.object,
  person: PT.object,
  sakId: PT.string,
  sakType: PT.string,
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VarslerPanel))
