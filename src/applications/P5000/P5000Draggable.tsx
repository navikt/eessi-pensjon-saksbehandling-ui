import { System } from '@navikt/ds-icons'
import { Accordion, Panel } from '@navikt/ds-react'
import { FlexDiv } from '@navikt/hoykontrast'
import { Draggable } from 'react-beautiful-dnd'

const P5000Draggable = ({
  index,
  table
}: any) => {

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: '1rem',
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'transparent',
    // styles we need to apply on draggables
    ...draggableStyle
  })

  return (
    <Draggable key={table.id} draggableId={table.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            ),
            padding: '0px'
          }}
        >
          <Panel border style={{padding: '0px'}}>
            <Accordion style={{borderRadius: '4px'}} id={'a-buc-c-' + table.id}>
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
}

export default P5000Draggable
