import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";

interface ProjectProps {
  id: number;
  category: any;
  name: any;
  description: any;
  team: Array<any>;
  status: any;
  dueDate : string;
}

const projects: Array<ProjectProps> = [
  {
    id: 0,
    category: "Design",
    name: "Dashboard UI",
    description: "Duis arcu suscipit eget",
    status: "active",
    dueDate : "2021-5-20",
    team: [
      {
        id: 1, img: avatar4, fullname: "Eliza Hardin"
      },
      {
        id: 2, img: avatar5, fullname: "Ronald Hatfield"
      },
    ],
  },
  {
    id: 1,
    category: "Design",
    name: "Ecommerce App",
    description: "Nemo enim ipsam sit",
    status: "active",
    dueDate : "2021-5-20",
    team: [
      {
        id: 1, img: avatar4, fullname: "Megan Seaton"
      },
      {
        id: 2, img: avatar5, fullname: "Ronald Hatfield"
      },
      {
        id: 3, img: "Null", name: "E", color: "info", fullname: "Eliza Hardin"
      },
    ],
  },
  {
    id: 2,
    category: "Development",
    name: "Kanban Board",
    status: "completed",
    dueDate : "2021-10-30",
    description: "Maecenas nec odio et ante",
    team: [
      {
        id: 1, img: "Null", name: "F", color: "primary", fullname: "Frank Snow"
      },
    ],
  },
  {
    id: 3,
    category: "Development",
    name: "Calendar App",
    status: "active",
    dueDate : "2021-7-20",
    description: "Itaque earum rerum ut",
    team: [
      {
        id: 1, img: avatar5, fullname: "Ronald Hatfield"
      },
    ],
  },
  {
    id: 4,
    category: "Design",
    status: "completed",
    dueDate : "2021-4-15",
    name: "Redesign - Landing Page",
    description: "Neque porro quisquam est",
    team: [
      {
        id: 1, img: "Null", name: "R", color: "info", fullname: "Rosa Armstrong"
      },
      {
        id: 2, img: "Null", name: "F", color: "success", fullname: "Frank Snow"
      },
    ],
  },
  {
    id: 5,
    category: "Development",
    name: "Authentication",
    status: "active",
    dueDate : "2021-9-19",
    description: "At vero eos et accusamus et",
    team: [
      {
        id: 1, img: avatar5, fullname: "Ronald Hatfield"
      },
    ],
  },
  {
    id: 5,
    category: "Design",
    status: "completed",
    dueDate : "2021-6-6",
    name: "Brand Logo Design",
    description: "Sed ut perspiciatis unde iste",
    team: [
      {
        id: 1, img: avatar1, fullname: "Janna Johnson"
      },
      {
        id: 2, img: avatar2, fullname: "Heather Ford"
      },
      {
        id: 3, img: "Null", name: "E", color: "info", fullname: "Eliza Hardin"
      },
      {
        id: 4, img: avatar4, fullname: "Megan Seaton"
      },
    ],
  },
  {
    id: 6,
    category: "Development",
    status: "completed",
    dueDate : "2021-7-4",
    name: "Chat App",
    description: "Quis autem vel eum iure",
    team: [
      {
        id: 1, img: avatar4, fullname: "Megan Seaton"
      },
      {
        id: 2, img: avatar5, fullname: "Ronald Hatfield"
      },
      {
        id: 3, img: avatar2, fullname: "Heather Ford"
      },
    ],
  },
];

export { projects };