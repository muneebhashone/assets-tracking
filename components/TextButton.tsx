"use client"
import React from 'react'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const TextButton = ({ text }: { text: string }) => {

    const { status } = useSession()
    const { push } = useRouter()
    const handleTrackingButton = () => {
        if (status === 'authenticated') {
            push('/dashboard/shipment')
        }
        push('/signin')

    }
    return (
        <Button className="bg-[#D3991F] text-white text-lg py-5" onClick={handleTrackingButton}>
            {text}
        </Button>
    )
}
