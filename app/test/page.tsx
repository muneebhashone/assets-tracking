import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";

export default function ShipmentTrackingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-zinc-700">
            Single Shipment
          </CardTitle>
          <CardDescription className="mt-2 mb-6">
            <p className="text-neutral-300 text-sm mb-6">
              You can track shipment by Container Number or MBL / Booking
              Number.
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircledIcon className="text-[#348cd4]" />
              <span className="text-neutral-500 font-medium">
                Choose the carrier.
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircledIcon className="text-[#348cd4]" />
              <span className="text-neutral-500 font-medium">
                Enter your Container, Booking or BL Number.
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircledIcon className="text-[#348cd4]" />
              <span className="text-neutral-500 font-medium">
                Click to the "Create" button.
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div className="flex justify-between gap-4">
            <div className="space-y-2 w-[100%]">
              <Label htmlFor="carrier" className="text-neutral-500 font-medium">
                Carrier
              </Label>
              <Select>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select a carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carrier1">Carrier 1</SelectItem>
                  <SelectItem value="carrier2">Carrier 2</SelectItem>
                  <SelectItem value="carrier3">Carrier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-[100%]">
              <Label
                htmlFor="trackWith"
                className="text-neutral-500 font-medium"
              >
                Track with
              </Label>
              <Select>
                <SelectTrigger id="trackWith">
                  <SelectValue placeholder="Container Number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="containerNumber">
                    Container Number
                  </SelectItem>
                  <SelectItem
                    value="bookingNumber"
                    className="text-neutral-500 font-medium"
                  >
                    MBL / Booking Number
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="containerNumber"
              className="text-neutral-500 font-medium"
            >
              Container Number
            </Label>
            <Input
              id="containerNumber"
              placeholder="Enter Container Number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mblNumber" className="text-neutral-500 font-medium">
              MBL / Booking Number
            </Label>
            <Input
              id="mblNumber"
              placeholder="Enter Mobile or Lading Number"
              required={true}
            />
          </div>
        </CardContent>
        <CardFooter className="w-full justify-end ">
          <Button type="submit" className="w-[25%] border-r-4">
            <span className="mr-2">Create</span>
            <PlusCircledIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
