"use client";
import useQueryUpdater from "@/hooks/useQueryUpdater";
import { useCurrentUser } from "@/services/auth.mutations";
import { useGetUserById } from "@/services/user.queries";
import { User } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { Edit2Icon } from "lucide-react";
import PermissionUpdate from "../forms/permission-update-form";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
interface UserDetailPageProps {
  id: string;
}
const UserDetailPage = ({ id }: UserDetailPageProps) => {
  const { data: user, isLoading } = useGetUserById({ id });
  const { querySetter } = useQueryUpdater();
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="w-full">
      <section className="bg-muted py-12 md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              User # {id}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              User Details Overview
            </p>
          </div>
        </div>
      </section>
      <section className=" md:py-20 lg:py-12">
        <div className="container px-4 md:px-6">
          <div className=" mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap mb-4">
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    <Label htmlFor="name">Name: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] py-2" />
                    ) : (
                      <p>{user?.data.name ?? "N/A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    <Label htmlFor="email">Email: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] py-2" />
                    ) : (
                      <p>{user?.data.email ?? "N/A"}</p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    <Label htmlFor="phone">Phone Number: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] py-2" />
                    ) : (
                      <p>{user?.data.phoneNo ?? "N/A"}</p>
                    )}
                  </div>

                  {user?.data.companyId && (
                    <div className="flex flex-col basis-1/3 gap-3 mb-4">
                      <Label htmlFor="company">Company: </Label>
                      {isLoading ? (
                        <Skeleton className="h-4 w-[200px] py-2" />
                      ) : (
                        <p>{user?.data.company?.name}</p>
                      )}
                    </div>
                  )}

                  {user?.data.clientId && (
                    <div className="flex flex-col basis-1/3 gap-3 mb-4">
                      <Label htmlFor="client">Client: </Label>
                      {isLoading ? (
                        <Skeleton className="h-4 w-[200px] py-2" />
                      ) : (
                        <p>{user?.data.client?.name}</p>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    <Label htmlFor="active">Active : </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] py-2" />
                    ) : (
                      <Badge
                        className={`${
                          user?.data?.isActive ? "bg-green-500" : "bg-red-700"
                        } w-fit`}
                      >
                        {user?.data.isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    <Label htmlFor="status">Status: </Label>
                    {isLoading ? (
                      <Skeleton className="h-4 w-[200px] py-2" />
                    ) : (
                      <p className="capitalize">
                        {user?.data.status?.toLowerCase() ?? "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col basis-1/3 gap-3 mb-4">
                    {(currentUser?.user.role === "SUPER_ADMIN" ||
                      checkPermissions(
                        currentUser?.user.permissions as PermissionsType[],
                        ["VIEW_PERMISSIONS"],
                      )) && (
                      <Label htmlFor="status" className="flex justify-between">
                        Permissions:{" "}
                        {(currentUser?.user.role === "SUPER_ADMIN" ||
                          checkPermissions(
                            currentUser?.user.permissions as PermissionsType[],
                            ["UPDATE_PERMISSIONS"],
                          )) && (
                          <Edit2Icon
                            onClick={() =>
                              querySetter("pe", `${user?.data.id}`)
                            }
                            className="mr-6 w-5 h-5 cursor-pointer"
                          />
                        )}
                      </Label>
                    )}

                    {(currentUser?.user.role === "SUPER_ADMIN" ||
                      checkPermissions(
                        currentUser?.user.permissions as PermissionsType[],
                        ["VIEW_PERMISSIONS", "UPDATE_PERMISSIONS"],
                      )) && <PermissionUpdate row={user?.data as User} />}
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

export default UserDetailPage;
