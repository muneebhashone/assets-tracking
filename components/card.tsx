import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Shipment } from "@prisma/client"
import Link from "next/link"

export function ShippingCard({ data }: { data: Shipment }) {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{data.carrier}</CardTitle>

            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="type">Type: {data.type}</Label>
                            <Label htmlFor="number">Tracking Number: {data.tracking_number}</Label>
                            <Label htmlFor="sealine_name">Sealine Name: {data.status}</Label>
                            <Label htmlFor="status">Status: {data.status}</Label>
                            <Label htmlFor="status">Estd. Time: {data.arrivalTime}</Label>

                        </div>

                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">

                <Link className="border rounded-md px-4 py-2 transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    href={`/dashboard/shipment/${data.tracking_number}`}>Details</ Link>
            </CardFooter>
        </Card>
    )
}