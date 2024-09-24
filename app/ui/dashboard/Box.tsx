import type { CSSProperties, FC } from 'react'
import { memo, useEffect } from 'react'
import { useDrag } from 'react-dnd'

const style: CSSProperties = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}

export interface BoxProps {
    name: string
    type: string
    path: string
    isDropped: boolean,
    onDragging: (name: string) => void;
}

export const Box: FC<BoxProps> = memo(function Box({ name, type, isDropped, path, onDragging }) {
    const [{ opacity, isDragging }, drag,] = useDrag(
        () => ({
            type,
            item: { name },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
                isDragging: monitor.isDragging()
            }),
        }),
        [name, type],
    )
    useEffect(() => {
        onDragging(name);
    }, [isDragging])
    const ref: any = drag;
    return (
        <div ref={ref} style={{ ...style, opacity, display: isDropped ? 'none' : 'initial' }} data-testid="box">
            {isDropped ? <></> :
                <img src={`/ayat/${path}/ayat${name}.png`} style={{ objectFit: 'contain', width: '300px', height: '100px' }} />}


        </div>
    )
})
