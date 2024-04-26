"use client"


import React from 'react'
import { ShippingCard } from '../card'
import { ShipmentProps } from '@/types'

export const ShippingCardsView = (props: ShipmentProps) => {
    const { shipData } = props
    return (
        <div className='grid grid-cols-3 gap-4'>
            {shipData.map((ship) => {
                return (
                    <ShippingCard data={ship} />

                )
            })}
        </div>
    )
}
