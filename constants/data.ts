import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types/api.types";



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
  // {
  //   title: "Track New Shipment",
  //   href: "/dashboard/shipment",
  //   icon: "moon",
  //   label: "Shipment",
  //   permissions: ["CREATE_SHIPMENT"],
  // },
  {
    title: "Acitve User",
    href: "/dashboard/active-users",
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
  // {
  //   title: "Rejected User",
  //   href: "/dashboard/rejectedUsers",
  //   icon: "employee",
  //   label: "employee",
  //   permissions: ["VIEW_USER"],
  // },
  {
    title: "Company",
    href: "/dashboard/company",
    icon: "laptop",
    label: "company",
    permissions: ["VIEW_COMPANY"],
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
