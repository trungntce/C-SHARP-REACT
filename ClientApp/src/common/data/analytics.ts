import us from "../../assets/images/flags/us.jpg";
import spain from "../../assets/images/flags/spain.jpg";
import germany from "../../assets/images/flags/germany.jpg";
import italy from "../../assets/images/flags/italy.jpg";

interface usersProps {
    id: number;
    icon: string;
    title: string;
    counting: string;
    percentage: string;
    badge: string;
    badgeicon: string;
}

interface visitorProps {
    id: number;
    title: string;
    price: number;
    rank?: number;
    isPercentage: boolean;
    series: Array<any>;
}

interface visitorBrowserProps {
    id: number;
    icon: string;
    title: string;
    percentage: number;
}

interface TrafficSourceProps {
    id: number;
    websitelink: string;
    traffic: string;
    percentage: number;
}

interface  VisitorByLocationProps{
    id: number;
    image : string;
    title : string;
    rank : number;
    percentage : number
}

interface  ChannelsProps{
    id: number;
    source : string;
    session : number;
    users : number;
    bouncerate : number;
}

const users: Array<usersProps> = [
    {
        id: 1,
        icon: "fas fa-user",
        title: "Users",
        counting: "2.2 k",
        percentage: "1.2",
        badge: "badge badge-soft-success ms-2",
        badgeicon: "uil uil-arrow-up-right text-success"
    },
    {
        id: 2,
        icon: "fas fa-hourglass-start",
        title: "Sessions",
        counting: "3.85 k",
        percentage: "1.2",
        badge: "badge badge-soft-danger ms-2",
        badgeicon: "uil uil-arrow-down-left text-danger"
    },
    {
        id: 3,
        icon: "fas fa-stopwatch",
        title: "Session Duration",
        counting: "1 min",
        percentage: "1.1",
        badge: "badge badge-soft-danger ms-2",
        badgeicon: "uil uil-arrow-down-left text-danger"
    },
    {
        id: 4,
        icon: "fas fa-chart-area",
        title: "Bounce Rate",
        counting: "24.03 %",
        percentage: "1.2",
        badge: "badge badge-soft-success ms-2",
        badgeicon: "uil uil-arrow-up-right text-success"
    },
];

const visitors: Array<visitorProps> = [
    {
        id: 1,
        title: "New Visitors",
        price: 1.2,
        rank: 0.2,
        isPercentage: true,
        series: [{name: "New Visitors", data: [21, 65, 32, 80, 42, 25]}],
    },
    {
        id: 2,
        title: "Users",
        price: 2.2,
        isPercentage: false,
        series: [{name: "Users", data: [40, 30, 51, 33, 63, 50]}],
    },
    {
        id: 3,
        title: "Sessions",
        price: 3.85,
        rank: 1.2,
        isPercentage: true,
        series: [{name: "Sessions", data: [21, 55, 32, 80, 42, 25]}],
    }
];

const VisitorbyBrowsers: Array<visitorBrowserProps> = [
    {
        id: 1,
        icon : "fab fa-chrome",
        title: "Chrome",
        percentage : 82
    },
    {
        id: 2,
        icon : "fab fa-firefox-browser",
        title: "Firefox",
        percentage : 70
    },
    {
        id: 3,
        icon : "fab fa-safari",
        title: "Safari",
        percentage : 76
    },
    {
        id: 4,
        icon : "fab fa-edge",
        title: "Edge",
        percentage : 67
    },
];

const trafficSources:Array<TrafficSourceProps> = [
    {
        id: 1,
        websitelink : "www.abc.com",
        traffic: "3.82 k",
        percentage : 1.2
    },
    {
        id: 2,
        websitelink : "www.xyz.com",
        traffic: "3.04 k",
        percentage : 1.1
    },
    {
        id: 3,
        websitelink : "www.abc123.com",
        traffic: "2.64 k",
        percentage : 0.8
    },
    {
        id: 4,
        websitelink : "www.xyz.com",
        traffic: "2.06 k",
        percentage : 0.5
    }
];

const countries:Array<VisitorByLocationProps> = [
    {
        id: 1,
        image : us,
        title: "United States",
        rank : 81,
        percentage : 0.02
    },
    {
        id: 2,
        image : spain,
        title: "Spain",
        rank : 77,
        percentage : 0.01
    },
    {
        id: 3,
        image : germany,
        title: "Germany",
        rank : 80,
        percentage : 0.03
    },
    {
        id: 4,
        image : italy,
        title: "Italy",
        rank : 73,
        percentage : 0.01
    },
];

const channels:Array<ChannelsProps> = [
    {
        id: 1,
        source : "Social",
        session: 648,
        users : 432,
        bouncerate : 27.38
    },
    {
        id: 2,
        source : "Direct",
        session: 524,
        users : 385,
        bouncerate : 35.16
    },
    {
        id: 3,
        source : "Email",
        session: 432,
        users : 390,
        bouncerate : 30.20
    },
    {
        id: 4,
        source : "Referral",
        session: 521,
        users : 423,
        bouncerate : 29.05
    },
    {
        id: 5,
        source : "Others",
        session: 602,
        users : 553,
        bouncerate : 33.14
    },
];

export { users, visitors, VisitorbyBrowsers, trafficSources, countries, channels };