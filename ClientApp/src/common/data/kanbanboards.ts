import avatar2 from "../../assets/images/users/avatar-2.jpg";

const tasks = [
  {
    id: 1,
    title: "Todo",
    tasks: [
      {
        id: 11,
        taskid: "DS-045",
        title: "Dashboard UI",
        description: "Sed ut perspiciatis unde omnis iste",
        team: [
          { id: 1, name: "Emily Surface", img: "Null" , badgeclass: "primary" },
        ],
        status: "Open",
        badgecolor: "primary",
        date: "09 Mar, 2020",
      },
      {
        id: 12,
        taskid: "DS-046",
        title: "Calendar App Page",
        description: "Neque porro quisquam est",
        team: [
          { id: 2, name: "James Scott", img: avatar2 },
          { id: 3, name: "Emily Surface", img: "Null" , badgeclass: "info" },
        ],
        status: "Open",
        badgecolor: "primary",
        date: "08 Mar, 2020",
      },
      {
        id: 13,
        taskid: "DS-047",
        title: "Authentication Page Design",
        description: "In enim justo rhoncus ut",
        team: [
          { id: 5, name: "Emily Surface", img: "Null" , badgeclass: "danger" },
        ],
        status: "Open",
        badgecolor: "primary",
        date: "08 Mar, 2020",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      {
        id: 21,
        taskid: "DS-044",
        title: "Component Pages",
        description: "Donec quam felis ultricies nec",
        team: [
          { id: 7, name: "James Scott", img: avatar2 },
        ],
        status: "Inprogress",
        badgecolor: "warning",
        date: "08 Mar, 2020",
      },
    ],
  },
  {
    id: 3,
    title: "Completed",
    tasks: [
      {
        id: 31,
        taskid: "DS-041",
        title: "Admin Layout Design",
        description: "At vero eos et accusamus et",
        team: [
          { id: 10, name: "James Scott", img: avatar2 },
          { id: 11, name: "Lynn Hackett", img: "Null" , badgeclass: "info" },
        ],
        status: "Completed",
        badgecolor: "success",
        date: "06 Mar, 2020",
      },
      {
        id: 32,
        taskid: "DS-042",
        title: "Brand Logo Design",
        description: "Nemo enim ipsam voluptatem",
        team: [
          { id: 12, name: "Emily Surface", img: "Null" , badgeclass: "primary" },
        ],
        status: "Completed",
        badgecolor: "success",
        date: "07 Mar, 2020",
      },
    ],
  },
];

const series = [
  {
    name: "Complete Tasks",
    type: "column",
    data: [23, 11, 22, 27, 13, 22, 52, 21, 44, 22, 30],
  },
  {
    name: "All Tasks",
    type: "line",
    data: [23, 11, 34, 27, 17, 22, 62, 32, 44, 22, 39],
  },
];

const options = {
  chart: { height: 280, type: "line", stacked: !1, toolbar: { show: !1 } },
  stroke: { width: [0, 2, 5], curve: "smooth" },
  plotOptions: { bar: { columnWidth: "20%", endingShape: "rounded" } },
  colors: ["#556ee6", "#34c38f"],
  fill: {
    gradient: {
      inverseColors: !1,
      shade: "light",
      type: "vertical",
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100],
    },
  },
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ],
  markers: { size: 0 },
  yaxis: { min: 0 },
};

const statusClasses = {
  waiting: "badge-soft-secondary",
  approved: "badge-soft-primary",
  complete: "badge-soft-success",
  pending: "badge-soft-warning",
};

export { tasks, series, options, statusClasses };