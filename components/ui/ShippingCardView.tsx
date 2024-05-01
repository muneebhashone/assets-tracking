"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ShipmentProps } from '@/types'
import Link from 'next/link'

export const ShippingCardsView = (props: ShipmentProps) => {
    const { shipData } = props
    return (
        <div className='grid grid-cols-3 gap-4'>
            {shipData.map((ship) => {
                return (
                    <>
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>{ship.carrier}</CardTitle>

                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="type">Type: {ship.type}</Label>
                                            {ship.user && <Label htmlFor="type">User Name: {ship.user.name}</Label>}
                                            <Label htmlFor="number">Tracking Number: {ship.tracking_number}</Label>
                                            <Label htmlFor="sealine_name">Sealine Name: {ship.status}</Label>
                                            <Label htmlFor="status">Status: {ship.status}</Label>
                                            <Label htmlFor="status">Estd. Time: {ship.arrivalTime}</Label>

                                        </div>

                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-between">

                                <Link className="border rounded-md px-4 py-2 transition-colors bg-[#D3991F] text-primary-foreground shadow hover:bg-primary/90"
                                    href={`/dashboard/shipment/${ship.tracking_number}`}>Details</ Link>
                            </CardFooter>
                        </Card>
                    </>

                )
            })}
        </div>
    )
}
