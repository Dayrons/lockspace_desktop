import React from 'react'
import { Password } from './Password'
import { useSelector, useDispatch } from 'react-redux'
import {DndContext, closestCenter} from '@dnd-kit/core'
import {SortableContext, arrayMove, verticalListSortingStrategy} from '@dnd-kit/sortable'
import { setPasswords } from '../context/slice/AppSlice';
export  function ListPassword() {
  const dispatch = useDispatch()
  const state = useSelector(state => state.app)
  
  const handleDragEnd = (e)=>{
    const {active, over}= e
    const passwords = state.passwords
    const oldIndex =  passwords.findIndex((password)=>active.id === password.id)
    const newIndex =  passwords.findIndex((password)=>over.id === password.id)
    const newArray = arrayMove(passwords, oldIndex, newIndex)
    dispatch(setPasswords(newArray))
  }

  return (
    <div style={{
        width:"80%",
        margin:"auto",
        marginTop:"20px"
    }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
        items={state.passwords}
        strategy={verticalListSortingStrategy}
        >
          {state.passwords.map(password=><Password password={password}/>)}

        </SortableContext>

      </DndContext>

    </div>
  )
}
