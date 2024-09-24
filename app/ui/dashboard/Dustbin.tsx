import type { CSSProperties, FC, LegacyRef } from 'react'
import { memo } from 'react'
import { useDrop } from 'react-dnd'

const style: CSSProperties = {
    height: '12rem',
    width: '12rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}

export interface DustbinProps {
    accept: string[]
    lastDroppedItem?: any
    onDrop: (item: any) => void,
    index: any,
    isSubmit: boolean,
    isPreview: boolean
    onDelete: (item: any) => void,
    name:string
}

export const Dustbin: FC<DustbinProps> = memo(function Dustbin({
    accept,
    lastDroppedItem,
    onDrop,
    index, isSubmit,
    isPreview,
    onDelete,
    name
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const isActive = isOver && canDrop
    let backgroundColor = '#fff'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    } else if (isSubmit) {
        if (parseInt(lastDroppedItem?.name) === parseInt(index))
            backgroundColor = "green";
        else
            backgroundColor = "red";
    }
    const ref: any = drop;
    return (
        <div ref={ref} style={{ ...style, backgroundColor, border: '1px solid #000' }} data-testid="dustbin" >
            {isPreview ? <>
                <h2 style={{ color: '#000', fontSize: '2rem' }}>{index}</h2>
                <img src={`/ayat/${name}/ayat${index}.png`} />
            </> :
                <>
                    {backgroundColor === "red" && <img src={`/ayat/${name}/ayat${index}.png`} />}
                    {isActive ? "Release Drop" : <h2 style={{ color: '#000', fontSize: '2rem' }}>{index}</h2>}

                    {lastDroppedItem && (
                        <img src={`/ayat/${name}/ayat${lastDroppedItem.name}.png`} />
                    )}

                </>}
            {lastDroppedItem && <span onClick={() => { onDelete(lastDroppedItem) }}> Delete</span>}
        </div>
    )
})
