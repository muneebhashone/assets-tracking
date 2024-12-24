import { AdminDashboardStats } from "@/services/user.queries";
import {
  ShipmentStatusDisplay,
  StatusBadgeColor,
  TrackWithDisplay,
  UserRole,
} from "@/utils/constants";
import { formatDistance } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatCard } from "./stat-card";

interface AdminDashboardProps {
  data: AdminDashboardStats | undefined;
  isLoading: boolean;
}

export default function AdminDashboard({
  data,
  isLoading,
}: AdminDashboardProps) {
  if (!data) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-[100px] bg-gray-200  rounded-md" />
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card
              key={i}
              className={`animate-pulse ${
                i === 3 ? "md:col-span-2" : "col-span-1"
              }`}
            >
              <CardContent className="h-[300px] bg-gray-200  rounded-md" />
            </Card>
          ))}
        </div>
      </div>
    );
  }
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const shipmentTrendData = data && [
    {
      period: "Today",
      ...data.shipments.newShipments.today.byStatus,
      total: data.shipments.newShipments.today.total,
    },
    {
      period: "Last 7 Days",
      ...data.shipments.newShipments.last7Days.byStatus,
      total: data.shipments.newShipments.last7Days.total,
    },
    {
      period: "Last 30 Days",
      ...data.shipments.newShipments.last30Days.byStatus,
      total: data.shipments.newShipments.last30Days.total,
    },
  ];

  const allStatusKeys =
    data &&
    Array.from(
      new Set([
        ...Object.keys(data.shipments.newShipments.today.byStatus),
        ...Object.keys(data.shipments.newShipments.last7Days.byStatus),
        ...Object.keys(data.shipments.newShipments.last30Days.byStatus),
      ]),
    );

  const userGrowthData = data && [
    { name: "Today", value: data.users.newUsers.today },
    { name: "Last 7 Days", value: data.users.newUsers.last7Days },
    { name: "Last 30 Days", value: data.users.newUsers.last30Days },
  ];

  return (
    <div className="space-y-4">
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.users.totalUsers}
          description={`+${data.users.newUsers.today} today`}
        />
        <StatCard
          title="Total Companies"
          value={data.companies.totalCompanies}
          description={`${data.companies.activeCompanies} active`}
        />
        <StatCard
          title="Total Shipments"
          value={data.shipments.totalShipments}
          description={`+${data.shipments.newShipments.today.total} today`}
        />
        <StatCard
          title="New Companies (30d)"
          value={data.companies.newCompanies.last30Days}
        />
      </div>

    
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
       
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {Object.keys(data.users.roleDistribution).length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(data.users.roleDistribution).map(
                      ([key, value]) => ({
                        name: UserRole[key as keyof typeof UserRole],
                        value: value,
                      }),
                    )}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(data.users.roleDistribution).map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

    
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {userGrowthData?.every((item) => item.value === 0) ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Shipment Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {Object.keys(data.shipments.statusDistribution).length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(data.shipments.statusDistribution).map(
                      ([key, value]) => ({
                        name: ShipmentStatusDisplay[
                          key as keyof typeof ShipmentStatusDisplay
                        ],
                        value: value,
                      }),
                    )}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {Object.entries(data.shipments.statusDistribution).map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

       
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            {data.shipments.recentShipments.length === 0 ? (
              <div className="flex h-[100px] items-center justify-center text-muted-foreground">
                No recent shipments
              </div>
            ) : (
              <div className="space-y-4">
                {data.shipments.recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {shipment.containerNo ?? shipment.mblNo} (
                        {
                          TrackWithDisplay[
                            shipment.trackWith as keyof typeof TrackWithDisplay
                          ]
                        }
                        )
                      </p>
                      {shipment.status && (
                        <p
                          className={`text-sm text-${
                            StatusBadgeColor[shipment.status].color
                          }`}
                        >
                          {
                            ShipmentStatusDisplay[
                              shipment.status as keyof typeof ShipmentStatusDisplay
                            ]
                          }
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistance(
                        new Date(shipment.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Shipment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {shipmentTrendData?.every((item) => item.total === 0) ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shipmentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {allStatusKeys?.map((status, index) => (
                    <Bar
                      key={status}
                      dataKey={status}
                      name={
                        ShipmentStatusDisplay[
                          status as keyof typeof ShipmentStatusDisplay
                        ]
                      }
                      fill={COLORS[index % COLORS.length]}
                      stackId="a"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
