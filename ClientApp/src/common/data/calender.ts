interface CalendarEventProps {
  id: any;
  title: string;
  start: any;
  end?: any;
  allDay ?: any;
  className: string;
  url ?: string;
}

interface CalendarCategoriesProps {
  id: any;
  title: string;
  type: string;
  text: string;
}

const date = new Date();
const d = date.getDate();
const m = date.getMonth();
const y = date.getFullYear();

const events: Array<CalendarEventProps> = [
  {
    id: 1,
    title: "All Day Event",
    start: new Date(y, m, 1),
    className: "bg-primary"
  },
  {
    id: 2,
    title: "Long Event",
    start: new Date(y, m, d - 5),
    end: new Date(y, m, d - 2),
    className: "bg-warning"
  },
  {
    id: 3,
    title: "Repeating Event",
    start: new Date(y, m, d - 3, 16, 0),
    allDay: false,
    className: "bg-info"
  },
  {
    id: 4,
    title: "Repeating Event",
    start: new Date(y, m, d + 4, 16, 0),
    allDay: false,
    className: "bg-primary"
  },
  {
    id: 5,
    title: "Meeting",
    start: new Date(y, m, d, 10, 30),
    allDay: false,
    className: "bg-success"
  },
  {
    id: 6,
    title: "Lunch",
    start: new Date(y, m, d, 12, 0),
    end: new Date(y, m, d, 14, 0),
    allDay: false,
    className: "bg-danger"
  },
  {
    id: 7,
    title: "Birthday Party",
    start: new Date(y, m, d + 1, 19, 0),
    end: new Date(y, m, d + 1, 22, 30),
    allDay: false,
    className: "bg-success"
  },
  {
    id: 8,
    title: "Click for Google",
    start: new Date(y, m, 28),
    end: new Date(y, m, 29),
    url: "http://google.com/",
    className: "bg-dark"
  }
];

const calenderDefaultCategories: Array<CalendarCategoriesProps> = [
  {
    id: 1,
    title: "New Theme Release",
    type: "bg-success text-white",
    text: "text-success"
  },
  {
    id: 2,
    title: "My Event",
    type: "bg-info text-white",
    text: "text-info"
  },
  {
    id: 3,
    title: "Meet Manager",
    type: "bg-warning text-white",
    text: "text-warning"
  },
  {
    id: 4,
    title: "Report Error",
    type: "bg-danger text-white",
    text: "text-danger"
  },
];

export { calenderDefaultCategories, events };
