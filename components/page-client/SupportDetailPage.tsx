"use client";
import { useGetSupportFormById } from "@/services/admin/support.queries";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
interface SupportDetailPageProps {
  id: string;
}
const SupportDetailPage = ({ id }: SupportDetailPageProps) => {
  const { data: supportForm } = useGetSupportFormById({ id });
 
  return (
    <div className="w-full">
      <section className="bg-muted py-12 md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Support Form # {id}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Support Details Overview
            </p>
          </div>
        </div>
      </section>
      <section className=" md:py-20 lg:py-12">
        <div className="container px-4 md:px-6">
          <div className=" mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Support Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <p>{supportForm?.data.name}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <p>{supportForm?.data.email}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Phone Number</Label>
                      <p>{supportForm?.data.phoneNo}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="issue-category">Subject</Label>
                      <p>{supportForm?.data.subject}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="issue-description">Message</Label>
                      <p>{supportForm?.data.message}</p>
                    </div>

                    <div className="grid gap-2 ">
                      <Label htmlFor="attachment">Resolution Status</Label>
                      <Badge
                        className={`${
                          supportForm?.data?.resolved
                            ? "bg-green-500"
                            : "bg-red-700"
                        } w-fit`}
                      >
                        {supportForm?.data.resolved ? "Resolved" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportDetailPage;
