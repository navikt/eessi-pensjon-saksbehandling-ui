import _ from 'lodash'
import { Droppable } from 'react-beautiful-dnd'

const P5000Droppable = ({
  children,
  placeholderProps
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

  const getListStyle = (isDraggingOver: any) => ({
    backgroundColor: isDraggingOver ? 'lightblue' : 'transparent',
    position: 'relative' as 'relative'
  })

  return (
    <Droppable droppableId='droppable'>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {children}
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
  )
}

export default P5000Droppable
