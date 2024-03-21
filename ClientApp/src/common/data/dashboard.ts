import avatar9 from "../../assets/images/users/avatar-9.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";

interface DashboardProps {
    id : number;
    title : string;
    price : string;
    subtitle: string;
    charttype : string;
    fotmat: string;
    series : Array<any>;
}

const WidgetsData : Array<DashboardProps> = [
    {
        id: 1,
        title: "Total Revenue",
        price: "$46.34k",
        subtitle: "Earning this month",
        charttype: "bar",
        fotmat: "Monthly",
        series: [10, 20, 15, 40, 20, 50, 70, 60, 90, 70, 110]
    },
    {
        id: 2,
        title: "Total REFUNDS",
        price: "$895.02",
        subtitle: "Refunds this month",
        charttype: "area",
        fotmat: "Monthly",
        series: [10, 90, 30, 60, 50, 90, 25, 55, 30, 40]
    },
    {
        id: 3,
        title: "Active Users",
        price: "6,985",
        subtitle: "Users this Week",
        charttype: "bar",
        fotmat: "Weekly",
        series: [40, 20, 30, 40, 20, 60, 55, 70, 95, 65, 110]
    },
    {
        id: 4,
        title: "All Time Orders",
        price: "12,584",
        subtitle: "Total Number of Orders",
        charttype: "area",
        fotmat: "Yearly",
        series: [10, 90, 30, 60, 50, 90, 25, 55, 30, 40]
    }
];

interface OrderProps {
    id : number;
    orderno : string;
    date : string;
    status : string;
    icon : string;
    image : string;
    name: string;
    purchased : string;
    more ?: string;
    revenue: string
}

const OrderData : Array<OrderProps> = [
    {
        id: 1,
        orderno: "#DK1018",
        date: "1 Jun, 11:21",
        status: "Paid",
        icon: "mdi mdi-check-circle-outline text-success",
        image: avatar2,
        name : "Alex Fox",
        purchased: "Wireframing Kit for Figma",
        revenue: "$129.99"
    },
    {
        id: 2,
        orderno: "#DK1017",
        date: "29 May, 18:36",
        status: "Paid",
        icon: "mdi mdi-check-circle-outline text-success",
        image: avatar3,
        name : "Joya Calvert",
        purchased: "Mastering the Grid",
        more: "+2 more",
        revenue: "$228.88"
    },
    {
        id: 3,
        orderno: "#DK1016",
        date: "25 May , 08:09",
        status: "Refunded",
        icon: "mdi mdi-arrow-left-thin-circle-outline text-warning",
        image: avatar4,
        name : "Gracyn Make",
        purchased: "Wireframing Kit for Figma",
        revenue: "$9.99"
    },
    {
        id: 4,
        orderno: "#DK1015",
        date: "19 May , 14:09",
        status: "Paid",
        icon: "mdi mdi-check-circle-outline text-success",
        image: avatar5,
        name : "Monroe Mock",
        purchased: "Spiashify 2.0",
        revenue: "$44.00"
    },
    {
        id: 5,
        orderno: "#DK1014",
        date: "10 May , 10:00",
        status: "Paid",
        icon: "mdi mdi-check-circle-outline text-success",
        image: avatar6,
        name : "Lauren Bond",
        purchased: "Mastering the Grid",
        revenue: "$75.87"
    },
    {
        id: 6,
        orderno: "#DK1011",
        date: "29 Apr , 12:46",
        status: "Changeback",
        icon: "mdi mdi-close-circle-outline text-danger",
        image: avatar9,
        name : "Ricardo Schaefer",
        purchased: "Spiashify 2.0",
        revenue: "$63.99"
    },
    {
        id: 7,
        orderno: "#DK1010",
        date: "27 Apr , 10:53",
        status: "Paid",
        icon: "mdi mdi-check-circle-outline text-success",
        image: avatar10,
        name : "Arvi Hasan",
        purchased: "Wireframing Kit for Figma",
        revenue: "$51.00"
    },
   
];

export { WidgetsData, OrderData };