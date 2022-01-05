import { BackFilled, System, Warning } from '@navikt/ds-icons'
import { Accordion, Alert, Checkbox, BodyLong, Heading, Button, Panel } from '@navikt/ds-react'
import { getSed, resetSentP5000info, syncToP5000Storage, unsyncFromP5000Storage } from 'actions/p5000'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import { SeparatorSpan, SpinnerDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, BUCMode, FeatureToggles, LocalStorageEntry, LocalStorageValue } from 'declarations/app'
import { Buc, P5000FromRinaMap, Sed, Seds } from 'declarations/buc'
import { EmptyPeriodsReport, P5000Context, P5000SED, SedSender } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag from 'flagg-ikoner'
import _ from 'lodash'
import { Column, FlexCenterDiv, FlexDiv, HorizontalSeparatorDiv, PileDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Sort } from 'tabell'
import { getSedSender } from './conversion'
import P5000Edit from './P5000Edit'
import P5000Overview from './P5000Overview'
import P5000Sum from './P5000Sum'

export interface P5000Props {
  buc: Buc
  context: P5000Context
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P5000Selector {
  featureToggles: FeatureToggles
  locale: AllowedLocaleString
  p5000FromRinaMap: P5000FromRinaMap
  p5000Storage: LocalStorageEntry<P5000SED> | undefined
}

const mapState = (state: State): P5000Selector => ({
  featureToggles: state.app.featureToggles,
  locale: state.ui.locale,
  p5000FromRinaMap: state.p5000.p5000FromRinaMap,
  p5000Storage: state.p5000.p5000Storage
})

const P5000: React.FC<P5000Props> = ({
  buc,
  context,
  mainSed = undefined,
  setMode
}: P5000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    featureToggles, p5000FromRinaMap, p5000Storage
  }: P5000Selector = useSelector<State, P5000Selector>(mapState)

  const [placeholderProps, setPlaceholderProps] = useState<any>({})
  const [_activeSeds, _setActiveSeds] = useState<Seds>([])
  const [_fetchingP5000, _setFetchingP5000] = useState<Seds | undefined>(undefined)
  const [_ready, _setReady] = useState<boolean>(false)
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)

  const renderP5000EditHeader = () => {
    if (!mainSed) return null
    const sender: SedSender | undefined = getSedSender(mainSed)

    return <FlexCenterDiv>
      <Heading size='small' style={{display: 'flex'}}>
        {t('buc:p5000-edit-title')}
      </Heading>
      <HorizontalSeparatorDiv/>
      -
      <HorizontalSeparatorDiv/>
      {getLabel(mainSed, sender)}
    </FlexCenterDiv>
  }

  const renderP5000EditContent = (activeSeds: Seds, p5000FromStorage: LocalStorageValue<P5000SED> | undefined) => {
    if (!mainSed) return null
    return <P5000Edit
      caseId={buc.caseId!}
      onBackClick={onBackClick}
      key={'P5000Edit-' + mainSed.id + '-context-' + context + '-version-' + p5000FromStorage?.date}
      p5000FromRinaMap={p5000FromRinaMap}
      p5000FromStorage={p5000FromStorage}
      saveP5000ToStorage={saveP5000ToStorage}
      removeP5000FromStorage={removeP5000FromStorage}
      seds={[mainSed]}
    />
  }

  const renderP5000SumHeader = () => (
    <Heading size='small'>
      {t('buc:p5000-summary-title')}
    </Heading>
  )

  const renderP5000SumContent = (activeSeds: Seds, p5000FromStorage: LocalStorageValue<P5000SED> | undefined) => {
    const onlyNorwegianActiveSeds: Seds = _.filter(activeSeds, (sed: Sed) => sed.status !== 'received') ?? []
    return (
      <P5000Sum
        context={context}
        key={'P5000Sum' + onlyNorwegianActiveSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorage?.date}
        p5000FromRinaMap={p5000FromRinaMap}
        p5000FromStorage={p5000FromStorage}
        saveP5000ToStorage={saveP5000ToStorage}
        seds={onlyNorwegianActiveSeds}
      />
    )
  }

  const renderP5000OverviewHeader = () => (
    <Heading size='small'>
      {t('buc:p5000-overview-title')}
    </Heading>
  )

  const renderP5000OverviewContent = (activeSeds: Seds, p5000FromStorage: LocalStorageValue<P5000SED> | undefined) => {
    return (
      <P5000Overview
        context={context}
        key={'P5000Overview-' + activeSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorage?.date}
        p5000FromRinaMap={p5000FromRinaMap}
        p5000FromStorage={p5000FromStorage}
        seds={activeSeds}
      />
    )
  }

  const updateActiveSeds = (seds: any) => {
    _setActiveSeds(seds)
    updateTables(seds)
  }

  const renderTableContent = (id: string, activeSeds: Seds, p5000FromStorage: LocalStorageValue<P5000SED> | undefined) => {
    if (id === 'P5000Edit') return renderP5000EditContent(activeSeds, p5000FromStorage)
    if (id === 'P5000Sum') return renderP5000SumContent(activeSeds, p5000FromStorage)
    if (id === 'P5000Overview') return renderP5000OverviewContent(activeSeds, p5000FromStorage)
    return null
  }

  const renderTableHeader = (id: string) => {
    if (id === 'P5000Edit') return renderP5000EditHeader()
    if (id === 'P5000Sum') return renderP5000SumHeader()
    if (id === 'P5000Overview') return renderP5000OverviewHeader()
    return null
  }

  const [_tables, _setTables] = useState<Array<any>>(
    [
      { id: 'P5000Edit', content: <div> </div>, header: <div> </div> },
      { id: 'P5000Sum', content: <div> </div>, header: <div> </div> },
      { id: 'P5000Overview', content: <div> </div>, header: <div> </div> }
    ])

  useEffect(() => {
    updateTables(_activeSeds)
  }, [p5000Storage])

  const updateTables = (activeSeds: Seds) => {
    // use local storage stuff only in edit context, no need for overview context
    const p5000EntryFromStorage: LocalStorageValue | undefined = _.find(p5000Storage![buc.caseId!], { id: mainSed?.id })

    let newTables = _.cloneDeep(_tables)
    newTables = newTables.map(t => ({
      id: t.id,
      content: renderTableContent(t.id, activeSeds, p5000EntryFromStorage),
      header: renderTableHeader(t.id)
    }))
    _setTables(newTables)
  }

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: '1rem',
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'transparent',
    // styles we need to apply on draggables
    ...draggableStyle
  })

  const getListStyle = (isDraggingOver: any) => ({
    backgroundColor: isDraggingOver ? 'lightblue' : 'transparent',
    position: 'relative' as 'relative'
  })

  const getDraggedDom = (draggableId: any): Element => {
    const queryAttr = 'data-rbd-drag-handle-draggable-id'
    const domQuery = `[${queryAttr}='${draggableId}']`
    const draggedDOM = document.querySelector(domQuery)
    return draggedDOM!
  }

  const onDragStart = (event: any) => {
    const draggedDOM = getDraggedDom(event.draggableId)

    if (!draggedDOM) {
      return
    }

    const { clientHeight, clientWidth } = draggedDOM
    const sourceIndex = event.source.index
    // @ts-ignore
    const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
    // @ts-ignore
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr)
          const marginBottom = parseFloat(style.marginBottom)
          return total + curr.clientHeight + marginBottom
        }, 0)

    const { content } = _tables.find(
      (element) => element.id === event.draggableId
    )

    setPlaceholderProps({
      clientContent: content,
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        // @ts-ignore
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      )
    })
  }

  const onDragUpdate = (event: any) => {
    if (!event.destination) {
      return
    }

    const draggedDOM = getDraggedDom(event.draggableId)

    if (!draggedDOM) {
      return
    }

    const { clientHeight, clientWidth } = draggedDOM
    const destinationIndex = event.destination.index
    const sourceIndex = event.source.index

    // @ts-ignore
    const childrenArray = [...draggedDOM.parentNode.children]
    const movedItem = childrenArray[sourceIndex]
    childrenArray.splice(sourceIndex, 1)

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1)
    ]

    // @ts-ignore
    const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr)
        const marginBottom = parseFloat(style.marginBottom)
        return total + curr.clientHeight + marginBottom
      }, 0)

    const { content } = _tables.find(
      (element) => element.id === event.draggableId
    )

    setPlaceholderProps({
      clientContent: content,
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        // @ts-ignore
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      )
    })
  }

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const newSlots = reorder(
      _tables,
      result.source.index,
      result.destination.index
    )
    _setTables(newSlots)
  }
  const reorder = (slots: Array<string>, startIndex: number, endIndex: number) => {
    const result = Array.from(slots)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const saveP5000ToStorage = (newSed: P5000SED | undefined, sedId: string, sort?: Sort): void => {
    dispatch(syncToP5000Storage(newSed, buc.caseId, sedId, sort))
  }

  const removeP5000FromStorage = (sedId: string): void => {
    dispatch(unsyncFromP5000Storage(buc.caseId, sedId))
  }

  // select which P5000 SEDs we want to see
  const getP5000 = (buc: Buc): Seds | undefined => {
    if (!buc.seds) {
      return undefined
    }
    return buc.seds
      .filter(sedFilter)
      .filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled')
  }

  const onBackClick = () => {
    dispatch(resetSentP5000info())
    setMode('bucedit', 'back')
  }

  const renderBackLink = () => (
    <div style={{ display: 'inline-block' }}>
      <Button
        variant='secondary'
        onClick={onBackClick}
      >
        <BackFilled />
        <HorizontalSeparatorDiv size='0.25' />
        <span>
          {t('ui:back')}
        </span>
      </Button>
    </div>
  )

  const renderDraggableTable = (table: any, index: number): JSX.Element => {
    if ((table.id === 'P5000Edit' && context !== 'overview' && featureToggles.P5000_SUMMER_VISIBLE) ||
      (table.id === 'P5000Sum' && featureToggles.P5000_SUMMER_VISIBLE) ||
      (table.id === 'P5000Overview')
    ) {
      return (
        <Draggable key={table.id} draggableId={table.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <Panel border style={{ padding: '0px' }}>
                <Accordion style={{ borderRadius: '4px' }} id={'a-buc-c-' + table.id}>
                  <Accordion.Item defaultOpen renderContentWhenClosed>
                    <FlexDiv>
                      <div style={{padding: '1.5rem 1rem'}} {...provided.dragHandleProps}>
                        <System/>
                      </div>
                      <Accordion.Header>
                      {table.header}
                    </Accordion.Header>
                    </FlexDiv>
                    <Accordion.Content>
                      {table.content}
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Panel>
            </div>
          )}
        </Draggable>
      )
    } else {
      return <div />
    }
  }

  const changeActiveSed = (sed: Sed, checked: boolean): void => {
    let newActiveSeds: Seds = _.cloneDeep(_activeSeds)
    if (checked) {
      newActiveSeds = newActiveSeds.concat(sed)
    } else {
      newActiveSeds = _.filter(newActiveSeds, s => s.id !== sed.id)
    }
    updateActiveSeds(newActiveSeds)
  }

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    _activeSeds.forEach((sed: Sed) => {
      res[sed.id] = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapAnnen?.length > 0
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  // const sedSender: SedSender | undefined = mainSed ? getSedSender(mainSed) as SedSender : undefined
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  const getLabel = (sed: Sed, sender: SedSender | undefined) => (
    (
      <FlexCenterDiv style={{ flexWrap: 'wrap' }}>
        <span>
          {t('buc:form-dateP5000', { date: sender?.date })}
        </span>
        <SeparatorSpan>-</SeparatorSpan>
        {sender
          ? (
            <FlexCenterDiv>
              <Flag
                animate
                country={sender?.country}
                label={sender?.countryLabel}
                size='XS'
                type='circle'
                wave={false}
              />
              <HorizontalSeparatorDiv size='0.2' />
              <span>{sender?.countryLabel}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <span>{sender?.institution}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <SEDStatus
                status={sed.status}
              />
            </FlexCenterDiv>
            )
          : sed.id}
        {emptyPeriodReport[sed.id] && (
          <>
            <HorizontalSeparatorDiv size='0.5' />
            <Warning />
          </>
        )}
      </FlexCenterDiv>
    )
  )

  // this effect checks if we need to load seds, when buc/sed/context changes
  useEffect(() => {
    const seds = getP5000(buc)
    _setSeds(seds)
    // which Seds we do NOT have on cache? Load them.
    const cachedSedIds: Array<string> = Object.keys(p5000FromRinaMap)
    const notloadedSeds: Seds = _.filter(seds, sed => cachedSedIds.indexOf(sed.id) < 0)
    if (!_.isEmpty(notloadedSeds)) {
      _setReady(false)
      _setFetchingP5000(notloadedSeds)
      notloadedSeds.forEach(sed => {
        dispatch(getSed(buc.caseId!, sed))
      })
    } else {
      if (seds) {
        updateActiveSeds(seds)
      }
      _setFetchingP5000(undefined)
      _setReady(true)
    }
  }, [buc, context])

  useEffect(() => {
    if (!_ready && _.isArray(_fetchingP5000)) {
      if (!_.isEmpty(_fetchingP5000)) {
        // update _fetchingP5000 with new cached info from p5000FromRinaMap
        const cachedSedIds = Object.keys(p5000FromRinaMap)
        const notloadedSeds: Seds = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) < 0)
        if (!_.isEmpty(notloadedSeds)) {
          _setFetchingP5000(notloadedSeds)
        } else {
          if (!_.isNil(_seds)) {
            updateActiveSeds(_seds)
          }
          _setFetchingP5000(undefined)
          _setReady(true)
        }
      } else {
        if (!_.isNil(_seds)) {
          updateActiveSeds(_seds)
        }
        _setFetchingP5000(undefined)
        _setReady(true)
      }
    }
  }, [_fetchingP5000, p5000FromRinaMap])

  if (!_ready) {
    return (
      <SpinnerDiv>
        <WaitingPanel />
      </SpinnerDiv>
    )
  }

  return (
    <div key={_seds?.map(s => s.id).join(',')}>
      <Row>
        <Column>
          <PileDiv>
            <BodyLong>
              {t('buc:p5000-active-seds')}:
            </BodyLong>
            <VerticalSeparatorDiv size='0.5' />
            {_seds?.map(sed => {
              const sender: SedSender | undefined = getSedSender(sed)
              const label: JSX.Element = getLabel(sed, sender)
              return (
                <div key={sed.id}>
                  <Checkbox
                    size='small'
                    data-test-id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                    checked={_.find(_activeSeds, s => s.id === sed.id) !== undefined}
                    key={'a-buc-c-P5000overview__checkbox-' + sed.id}
                    id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeActiveSed(sed, e.target.checked)}

                  >
                    {label}
                  </Checkbox>
                  <VerticalSeparatorDiv size='0.5' />
                </div>
              )
            })}
          </PileDiv>

        </Column>
        <Column>
          {warning && (
            <Alert variant='warning'>
              {t('buc:form-P5000-warning')}
            </Alert>
          )}
        </Column>
      </Row>
      <VerticalSeparatorDiv size='3' />
      {renderBackLink()}
      <VerticalSeparatorDiv size='2' />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {_tables.map(renderDraggableTable)}
              {provided.placeholder}
              {!_.isEmpty(placeholderProps) && snapshot.isDraggingOver && (
                <div
                  className='placeholder'
                  style={{
                    position: 'absolute',
                    top: placeholderProps.clientY,
                    left: placeholderProps.clientX,
                    height: placeholderProps.clientHeight,
                    width: placeholderProps.clientWidth
                  }}
                >
                  <div style={getItemStyle(false, { opacity: 0.5 })}>
                    {placeholderProps.clientContent}
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default P5000
