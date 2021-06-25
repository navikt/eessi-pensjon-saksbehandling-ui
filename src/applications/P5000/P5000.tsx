import P5000Page from 'applications/P5000/P5000Page'
import { BUCMode } from 'declarations/app'
import { Buc, Sed } from 'declarations/buc'
import { P5000Context } from 'declarations/p5000'
import _ from 'lodash'
import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

export interface P5000Props {
  buc: Buc
  context: P5000Context
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P5000: React.FC<P5000Props> = ({
   buc,
   context,
   mainSed = undefined,
   setMode
}: P5000Props) => {

  const [slots, setSlots] = useState<any>(() => ({
    'slot1': 'P5000Edit',
    'slot2': 'P5000Sum',
    'slot3': 'P5000Overview'
  }))

  const onDragStart = (x: any) => {

console.log(x)  }

  const onDragEnd = (result: DropResult) => {

    if (!result.destination) { // 'dragged to nowhere'
      return
    }
    const targetedSlot = result.destination.droppableId
    const draggable = result.draggableId

    let newSlots = _.cloneDeep(slots)
    // drag to same spot
    if (newSlots[targetedSlot] === draggable) {
      return
    } else {
      let slotFromWhereDraggableCame: string = Object.keys(newSlots).find(key => newSlots[key] === draggable)!

      let temp = newSlots[targetedSlot]
      newSlots[targetedSlot] = draggable
      newSlots[slotFromWhereDraggableCame] = temp
      setSlots(newSlots)
    }
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <P5000Page buc={buc} context={context} mainSed={mainSed} setMode={setMode} slots={slots}/>
    </DragDropContext>
  )
}

export default P5000


