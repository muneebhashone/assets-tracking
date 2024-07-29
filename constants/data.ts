import { NavItem } from "@/types/user.types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    permissions: ["VIEW_DASHBOARD"],
  },
  {
    title: "Shipment List",
    href: "/dashboard/shipment-list",
    icon: "laptop",
    label: "Shipment",
    permissions: ["VIEW_SHIPMENT"],
  },

  {
    title: "Acitve User",
    href: "/dashboard/users",
    icon: "user",
    label: "user",
    permissions: ["VIEW_USER"],
  },
  {
    title: "Requested User",
    href: "/dashboard/requested-users",
    icon: "employee",
    label: "employee",
    permissions: ["VIEW_USER"],
  },

  {
    title: "Company",
    href: "/dashboard/company",
    icon: "laptop",
    label: "company",
    permissions: ["VIEW_COMPANY"],
  },
  {
    title: "Assigns",
    href: "/dashboard/assigns",
    icon: "laptop",
    label: "assigns",
    permissions: ["SUPER_ADMIN"],
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: "help",
    label: "support",
    permissions: ["SUPER_ADMIN"],
  },
];

export const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Shipment List",
    href: "/dashboard/shipment-list",
    icon: "laptop",
    label: "Shipment",
  },
  {
    title: "Track New Shipment",
    href: "/dashboard/shipment",
    icon: "moon",
    label: "Shipment",
  },
];

export const menuitems = [
  {
    id: 1,
    title: "Home",
    link: "#home",
  },
  {
    id: 2,
    title: "Features",
    link: "#features",
  },
  {
    id: 3,
    title: "FAQ",
    link: "#faq",
  },
];

export const testimoniallist = [
  {
    id: 1,
    title: "Notifications",
    src: "/images/notification.png",
    description:
      "Get intelligent tracking notifications and alerts, stay up-to-date about your shipments.",
  },
  {
    id: 2,
    title: "Live Position",
    src: "/images/location.png",
    description:
      "Reach the live position of your shipments with satellite system without any physical device.",
  },
  {
    id: 3,
    title: "Integration",
    src: "/images/settings.png",
    description:
      "Automatically track your shipments with API and show their shipments to your customers on your website.",
  },
  {
    id: 4,
    title: "Dashboard",
    src: "/images/chart.png",
    description:
      "Manage your shipments on all in one dashboard. Get valuable statistics and intelligent reports about them.",
  },
];

export const cardlisting = [
  {
    id: 1,
    title: "Voyage Summary",
    src: "/images/notificationcard.png",
    description:
      "Track every update about your shipment from booking stage to empty return of containers.",
  },
  {
    id: 2,
    title: "Inform All Parties",
    src: "/images/noti1.png",
    description:
      "Automatically inform all parties like exporter, importer, freight forwarder agent, custom brokers etc.",
  },
];
export const cardlist = [
  {
    id: 1,
    title: "Ease of Use",
    src: "/images/noti2.png",
    description:
      "A lineup that clears up confusion, a dashboard that instantly performs any wanted action",
  },
  {
    id: 2,
    title: "Statistics and Reports",
    src: "/images/noti3.png",
    description:
      "Statistics and special reports are prepared with the data you allow us to collect.",
  },
  {
    id: 3,
    title: "Share with Sub-accounts",
    src: "/images/noti4.png",
    description:
      "Your company customers and branch offices can also use the dashboard as a sub-account.",
  },
];

export const faqcardlist = [
  {
    id: 1,
    number: "2.5",
    text: "M",
    description: "Tracked Shipments",
    bgcolor: "bg-[#F7531F]",
  },
  {
    id: 2,
    number: "2",
    text: "M",
    description: "Route Search",
    bgcolor: "bg-[#D79712]",
  },
  {
    id: 3,
    number: "1300",
    text: "+",
    description: "Customers",
    bgcolor: "bg-[#3491FE]",
  },
  {
    id: 4,
    number: "95",

    description: "Different Countries",
    bgcolor: "bg-[#78C350]",
  },
];

export const faqaccordianlist = [
  {
    id: 1,
    value: "item-1",
    title: "What is the difference between a vessel and a vessel?",
    content:
      "Vessel is a vehicle that carries goods. A vessel is a vehicle that carries containers.",
  },
  {
    id: 2,
    value: "item-2",
    title: "Do you provide API service for container tracking?",
    content:
      "Vessel is a vehicle that carries goods. A vessel is a vehicle that carries containers.",
  },
  {
    id: 3,
    value: "item-3",
    title: "Do you provide API service for container tracking?",
    content:
      "Vessel is a vehicle that carries goods. A vessel is a vehicle that carries containers.",
  },
  {
    id: 4,
    value: "item-4",
    title: "Which carriers does  provide tracking support for?",
    content:
      "Vessel is a vehicle that carries goods. A vessel is a vehicle that carries containers.",
  },
];

export const company = [
  {
    id: 1,
    text: "About Us",
    link: "/",
  },
  {
    id: 2,
    text: "Who we are",
    link: "/",
  },
  {
    id: 3,
    text: "Service Finder",
    link: "/",
  },
  {
    id: 4,
    text: "Academy",
    link: "/",
  },
  {
    id: 5,
    text: "Stories",
    link: "/",
  },
];

export const resources = [
  {
    id: 1,
    text: "Support Center",
    link: "/",
  },
  {
    id: 2,
    text: "Privacy Policy",
    link: "/",
  },
  {
    id: 3,
    text: "Terms & Conditions",
    link: "/",
  },
];

export const info = [
  {
    id: 1,
    text: `Mile 13.5 Philip 
    Goldson Highway, Old DataPro Compound Bldg# 4 & 5, Ladyville`,
    link: "/",
  },
  {
    id: 2,
    text: "support@Example.com",
    link: "/",
  },
  {
    id: 3,
    text: "+90 (123) 456 7894",
    link: "/",
  },
];

export const movementDemoData = [
  {
    id: 1,
    location: "Port of Los Angeles",
    moves: "Loaded on Board",
    date: "2024-07-15T08:30:00",
    vessel: "Pacific Explorer",
    destination: true,
  },
  {
    id: 2,
    location: "Port of Shanghai",
    moves: "Departed",
    date: "2024-07-18T14:45:00",
    vessel: "Asian Star",
    destination: false,
  },
  {
    id: 3,
    location: "Port of Rotterdam",
    moves: "Vessel Arrived",
    date: "2024-07-20T11:15:00",
    vessel: "European Voyager",
    destination: true,
  },
  {
    id: 4,
    location: "Port of Singapore",
    moves: "Discharge",
    date: "2024-07-22T09:00:00",
    vessel: "Orient Express",
    destination: true,
  },
  {
    id: 5,
    location: "Port of New York",
    moves: "Departed",
    date: "2024-07-25T16:20:00",
    vessel: "Atlantic Courier",
    destination: false,
  },
];

export const containerDemoData = [
  {
    id: 1,
    container: "MSKU1234567",
    emptyToShipper: "XYZ Logistics",
    gateIn: "2024-07-15T09:30:00",
    gateOut: "2024-07-16T14:45:00",
    emptyReturn: "2024-07-20T11:20:00",
  },
  {
    container: "TEMU7654321",
    emptyToShipper: "ABC Freight",
    gateIn: "2024-07-17T10:15:00",
    gateOut: "2024-07-18T16:30:00",
    emptyReturn: "2024-07-22T13:45:00",
  },
  {
    id: 3,
    container: "CMAU2468135",
    emptyToShipper: "Global Shipping Co.",
    gateIn: "2024-07-19T08:45:00",
    gateOut: "2024-07-20T12:00:00",
    emptyReturn: "2024-07-24T10:30:00",
  },
  {
    id: 4,
    container: "OOLU9876543",
    emptyToShipper: "SeaWay Transport",
    gateIn: "2024-07-21T11:00:00",
    gateOut: "2024-07-22T17:15:00",
    emptyReturn: "2024-07-26T09:00:00",
  },
  {
    id: 5,
    container: "MAEU5432109",
    emptyToShipper: "FastTrack Logistics",
    gateIn: "2024-07-23T07:30:00",
    gateOut: "2024-07-24T13:45:00",
    emptyReturn: "2024-07-28T14:20:00",
  },
];
