'use client';
import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useState } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { ItemTypes } from './ItemTypes'
import { Dustbin } from './Dustbin'
import { Box } from './Box'
import { Button } from '../button';


interface DustbinState {
    accepts: string[]
    lastDroppedItem: any
}

interface BoxState {
    name: string
    type: string
}

export interface DustbinSpec {
    accepts: string[]
    lastDroppedItem: any
}
export interface BoxSpec {
    name: string
    type: string
}
export interface ContainerState {
    droppedBoxNames: string[]
    dustbins: DustbinSpec[]
    boxes: BoxSpec[]
}
const initialState = [
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
    { accepts: ["ayat"], lastDroppedItem: null },
]
export const Container: FC = memo(function Container() {
    const [ayat, setAyat] = useState<number>(5);
    const [isSubmit, setSubmit] = useState<boolean>(false);
    const [isPreview, setPreview] = useState<boolean>(false);
    const [randomBoxes, setRandomBoxes] = useState<BoxState[]>([]);

    const [dustbins, setDustbins] = useState<DustbinState[]>([...initialState])

    const [boxes, setBox] = useState<BoxState[]>([
        { name: '1', type: "ayat" },
        { name: '2', type: "ayat" },
        { name: '4', type: "ayat" },
        { name: '5', type: "ayat" },
        { name: '6', type: "ayat" },
        { name: '7', type: "ayat" },
        { name: '8', type: "ayat" },
        { name: '9', type: "ayat" },
        { name: '10', type: "ayat" },
        { name: '11', type: "ayat" },
        { name: '12', type: "ayat" },
        { name: '13', type: "ayat" },
        { name: '14', type: "ayat" },
        { name: '15', type: "ayat" },
        { name: '16', type: "ayat" },
        { name: '17', type: "ayat" },
        { name: '18', type: "ayat" },
        { name: '19', type: "ayat" },
        { name: '20', type: "ayat" },
    ])

    useEffect(() => {
        const shuffled = [...boxes.slice(0, ayat)].sort(() => 0.5 - Math.random()); // Shuffle the array
        setRandomBoxes(shuffled);
    }, [ayat])
    const onChangeAyat = (event: any) => {
        setAyat(parseInt(event.target.value));
    }
    const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([])

    function isDropped(boxName: string) {
        return droppedBoxNames.indexOf(boxName) > -1
    }

    const handleDrop = useCallback(
        (index: number, item: { name: string }) => {
            const { name } = item
            if (dustbins[index].lastDroppedItem) {
                return;
            }
            setDroppedBoxNames(
                update(droppedBoxNames, name ? { $push: [name] } : { $push: [] }),
            )
            setDustbins(
                update(dustbins, {
                    [index]: {
                        lastDroppedItem: {
                            $set: item,
                        },
                    },
                }),
            )
        },
        [droppedBoxNames, dustbins],
    )

    return (
        <div>

            <div style={{ overflow: 'hidden', clear: 'both', marginTop: '30px' }}>
                {[...dustbins].slice(0, ayat).map(({ accepts, lastDroppedItem }, index) => (
                    <Dustbin
                        accept={accepts}
                        lastDroppedItem={lastDroppedItem}
                        onDrop={(item) => handleDrop(index, item)}
                        isSubmit={isSubmit}
                        key={index}
                        index={index + 1}
                        isPreview={isPreview}
                    />
                ))}
            </div>

            <div style={{ overflow: 'hidden', clear: 'both' }}>
                {[...randomBoxes].slice(0, ayat).map(({ name, type }, index) => (
                    <Box
                        name={name}
                        type={type}
                        isDropped={isDropped(name)}
                        key={index}
                    />
                ))}
            </div>
            <div className="relative">
                <select
                    id="customer"
                    name="customerId"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={5}
                    onChange={onChangeAyat}
                >

                    {dustbins.map(({ accepts, lastDroppedItem }, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}

                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <Button style={{ marginTop: '2rem' }} type="submit" onClick={() => setSubmit(true)}>Submit</Button>
                <Button style={{ marginTop: '2rem' }} type="submit" onClick={() => setPreview(true)}>Preview</Button>
                <Button style={{ marginTop: '2rem' }} type="submit" onClick={() => {
                    setDustbins([...initialState])
                    setPreview(false)
                    setSubmit(false)
                }}>Reset</Button>
            </div>
        </div >
    )
})
