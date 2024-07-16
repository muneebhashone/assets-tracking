"use client";
import { useGetSupportFormById } from "@/services/admin/support.queries";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
interface SupportDetailPageProps {
  id: string;
}
const SupportDetailPage = ({ id }: SupportDetailPageProps) => {
  const { data: supportForm, isLoading } = useGetSupportFormById({ id });

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
                <div className="flex flex-row  mb-4">
                  <div className="flex flex-col basis-1/3 gap-3">
                    <Label htmlFor="name">Name: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <p>{supportForm?.data.name ?? "N/A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3">
                    <Label htmlFor="email">Email: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <p>{supportForm?.data.email ?? "N/A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3">
                    {" "}
                    <Label htmlFor="email">Phone Number: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <p>{supportForm?.data.phoneNo ?? "N/A"}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row ">
                  <div className="flex flex-col basis-1/3 gap-3">
                    <Label htmlFor="issue-category">Subject: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <p>{supportForm?.data.subject ?? "N/A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3">
                    {" "}
                    <Label htmlFor="attachment">Resolution Status: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <Badge
                        className={`${
                          supportForm?.data?.resolved
                            ? "bg-green-500"
                            : "bg-red-700"
                        } w-fit`}
                      >
                        {supportForm?.data.resolved ? "Resolved" : "Pending"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3">
                    {" "}
                    <Label htmlFor="issue-description">Message: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                    ) : (
                      <p>{supportForm?.data.message}</p>
                    )}
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
