"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { useGetAdminDashboardData } from "@/services/user.queries";

import { useGetUserDashboardStats } from "@/services/companies.queries";
import { UserRole } from "@/utils/constants";
import AdminDashboard from "../dashboard/admin-dashboard";
import UserDashboard from "../dashboard/user-dashboard";

// Main DashboardPage component remains the same
export default function DashboardPage() {
  const { data: currentUser, isFetching } = useCurrentUser();
  const { data: adminData, isFetching: isAdminFetching } =
    useGetAdminDashboardData({
      enabled: Boolean(
        currentUser?.user.role === "SUPER_ADMIN" ||
          currentUser?.user.role === "SUB_ADMIN",
      ),
    });

  const { data: userData, isFetching: isUserFetching } =
    useGetUserDashboardStats({
      enabled: Boolean(
        currentUser?.user.role !== "SUPER_ADMIN" &&
          currentUser?.user.role !== "SUB_ADMIN",
      ),
    });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight mb-5 ">
          {" "}
          {isFetching
            ? "Loading..."
            : `Hi, Welcome back ${currentUser?.user.name} ( ${
                UserRole[currentUser?.user.role as keyof typeof UserRole]
              } )`}
        </h2>
      </div>

      {(currentUser?.user.role === "SUPER_ADMIN" ||
        currentUser?.user.role === "SUB_ADMIN") && (
        <AdminDashboard data={adminData?.data} isLoading={isAdminFetching} />
      )}
      {currentUser?.user.role !== "SUPER_ADMIN" &&
        currentUser?.user.role !== "SUB_ADMIN" && (
          <UserDashboard data={userData?.data} isLoading={isUserFetching} />
        )}
    </div>
  );
}
