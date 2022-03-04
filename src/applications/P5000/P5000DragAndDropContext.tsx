import { DragDropContext, DropResult } from 'react-beautiful-dnd'

const P5000DragAndDropContext = ({
  children,
  tables,
  setTables,
  setPlaceholderProps
 }: any) => {

  const getDraggedDom = (draggableId: any): Element => {
    const queryAttr = 'data-rbd-drag-handle-draggable-id'
    const domQuery = `[${queryAttr}='${draggableId}']`
    const draggedDOM = document.querySelector(domQuery)
    return draggedDOM!
  }


  const reorder = (slots: Array<string>, startIndex: number, endIndex: number) => {
    const result = Array.from(slots)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragStart = (event: any) => {
    const draggedDOM = getDraggedDom(event.draggableId)
    if (!draggedDOM) {
      return
    }

    const {clientHeight, clientWidth} = draggedDOM
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

    const {content} = tables.find((element: any) => element.id === event.draggableId)

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
    const {clientHeight, clientWidth} = draggedDOM
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

    const {content} = tables.find((element: any) => element.id === event.draggableId)

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
      tables,
      result.source.index,
      result.destination.index
    )
    setTables(newSlots)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      {children}
    </DragDropContext>
  )
}

export default P5000DragAndDropContext
