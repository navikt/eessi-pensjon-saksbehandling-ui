import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import _ from 'lodash'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import { Icons, Nav, RefreshButton, TableSorter, WaitingPanel } from 'eessi-pensjon-ui'
import * as pinfoActions from 'actions/pinfo'
import * as storageActions from 'actions/storage'
import { ReactComponent as VeilederSVG } from 'resources/images/NavPensjonVeileder.svg'
import './VarslerPanel.css'

const mapStateToProps = /* istanbul ignore next */ (state) => {
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

const mapDispatchToProps = /* istanbul ignore next */ (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions, ...storageActions }, dispatch) }
}

export const VarslerPanel = (props) => {
  const { actions, aktoerId, file, fileList, isInvitingPinfo, invite, onUpdate, person, sakId, sakType, t, widget } = props

  const [isReady, setIsReady] = useState(false)
  const [_fileList, setFileList] = useState(undefined)
  const [_files, setFiles] = useState({})
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
    if (fileList !== undefined && _fileList === undefined) {
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

    if (file !== undefined && !isReady) {
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
      <Nav.Panel className='w-varslerPanel s-border'>
        <Nav.Systemtittel className='w-varslerPanel__noParams-title pb-3'>{t('ui:widget-overview-notifications')}</Nav.Systemtittel>
        <Nav.Veileder
          tekst={t('pinfo:error-noParams')}
          posisjon='høyre'
          type='feilmelding'
          fargetema='feilmelding'
        >
          <VeilederSVG />
        </Nav.Veileder>
      </Nav.Panel>
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
    <Nav.EkspanderbartpanelBase
      className='w-varslerPanel s-border'
      apen={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
      heading={<Nav.Systemtittel className='pb-3'>{t('ui:widget-overview-notifications')}</Nav.Systemtittel>}
    >
      <Nav.Row>
        <div className='col-md-4'>
          <div style={{ display: 'none' }}>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
            <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div>
          </div>
          <Nav.Veileder
            tekst={(
              <>
                {!_.isEmpty(invite)
                  ? <div dangerouslySetInnerHTML={{ __html: t(invite.message) }} />
                  : <div dangerouslySetInnerHTML={{ __html: t('ui:widget-overview-sendNotification-description', { user: user }) }} />}
              </>
            )}
            type={invite ? (invite.status === 'ERROR' ? 'feilmelding' : 'suksess') : 'normal'}
            fargetema={invite ? (invite.status === 'ERROR' ? 'feilmelding' : 'suksess') : 'normal'}
            posisjon='bunn'
          >
            <VeilederSVG />
          </Nav.Veileder>
          <div className='text-center'>
            <Nav.Hovedknapp
              id='w-varslerPanel__invite-button-id'
              className='w-varslerPanel__invite-button mt-3'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={onInviteButtonClick}
            >
              {isInvitingPinfo ? t('sending') : t('ui:widget-overview-sendNotification-button')}
            </Nav.Hovedknapp>
          </div>
        </div>
        <div className='col-md-8'>
          <div className='w-varslerPanel__title'>
            {/* <Undertittel>{t('ui:widget-overview-sendNotification-title')}</Undertittel> */}
            <div />
            <RefreshButton
              className='w-varslerPanel__refresh-button'
              labelRefresh={t('ui:refresh')}
              rotating={!isReady}
              onRefreshClicked={onRefreshHandle}
            />
          </div>
          {!_.isEmpty(items) ? (
            <TableSorter
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
                  needle: (it) => it.toLowerCase(),
                  toTableCell: (item) => (
                    <div>
                      <Icons className='mr-2' kind='nav-message-sent' />
                      <label>{item.type}</label>
                    </div>
                  )
                },
                { id: 'sender', label: t('ui:sender'), type: 'string' },
                { id: 'date', label: t('ui:dateandtime'), type: 'date' }
              ]}
            />
          ) : (
            <div align='center' className='p-2 font-italic'>{t('ui:widget-overview-sendNotification-noMessages')}</div>
          )}
        </div>
      </Nav.Row>
    </Nav.EkspanderbartpanelBase>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VarslerPanel))
