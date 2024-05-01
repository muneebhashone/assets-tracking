import React from 'react'
import { ShippingCardsView } from '../ui/ShippingCardView'
import { getAllShipments } from '@/actions/shipmentActions'
import { Shipment } from '@prisma/client'
import { ShipmentData } from '@/types'

type Props = {}

const AdminDashboard = async (props: Props) => {
  const shipmentData = await getAllShipments() as ShipmentData[]
  return (
    <>

      <div className="flex flex-col ">
        <h1 className="text-lg font-bold tracking-tight mb-4 ">All shipment</h1>
        {/* <p className="text-sm tracking-tight">
          
        </p> */}
        {/* <div className="flex my-5 justify-between">
          <Link
            className="border rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            href="/dashboard/shipment"
          >Create</Link>
          <Button variant="default">Export as pdf</Button>
        </div> */}
        {
          shipmentData?.length ?
            <ShippingCardsView shipData={shipmentData} /> : <h1>no record found</h1>
        }
      </div>
    </>
  )
}

export default AdminDashboard