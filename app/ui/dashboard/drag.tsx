'use client';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from './container-drag'

export default function Drag(props: any) {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Container {...props} />
            </DndProvider>
        </div>
    )
}