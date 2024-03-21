//images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar9 from "../../assets/images/users/avatar-9.jpg";

interface ChatUserProps {
  id: number;
  img?: any;
  name: string;
  designation: string;
  color?: string;
  email: string;
  projects: number;
  tags: Array<string>
}

const users: Array<ChatUserProps> = [
  {
    id: 1,
    img: avatar1,
    name: "Donald Risher",
    designation: "UI/UX Designer",
    color: "primary",
    email: "DonaldRisher@Dashonic.com",
    projects: 125,
    tags: ["Photoshop", "illustrator"],
  },
  {
    id: 2,
    img: avatar2,
    name: "Helen Barron",
    designation: "Frontend Developer",
    email: "HelenBarron@Dashonic.com",
    projects: 132,
    tags: ["Html", "Css", "Php"],
  },
  {
    id: 3,
    img: avatar3,
    name: "Philip Theroux",
    designation: "Backend Developer",
    email: "PhilipTheroux@Dashonic.com",
    projects: 1112,
    tags: ["Php", "Java", "Python", "Html"],
  },
  {
    id: 4,
    img: avatar4,
    name: "Justin McClain",
    designation: "Full Stack Developer",
    color: "success",
    email: "JustinMcClain@Dashonic.com",
    projects: 121,
    tags: ["Ruby", "Php", "UI/UX Designer"],
  },
  {
    id: 5,
    img: avatar5,
    name: "Sharon Carver",
    designation: "Frontend Developer",
    email: "SharonCarver@Dashonic.com",
    projects: 145,
    tags: ["Html", "Css", "Java"],
  },
  {
    id: 6,
    img: avatar6,
    name: "Jody Tondreau",
    designation: "Frontend Developer",
    email: "JodyTondreau@Dashonic.com",
    projects: 136,
    tags: ["Photoshop", "illustrator"],
  },
  {
    id: 7,
    img: avatar7,
    name: "Dennis Goulet",
    designation: "Graphic Designer",
    color: "info",
    email: "DennisGoulet@Dashonic.com",
    projects: 125,
    tags: ["Photoshop", "illustrator"],
  },
  {
    id: 8,
    img: avatar8,
    name: "Cecelia Farrell",
    designation: "Angular Developer",
    color: "",
    email: "CeceliaFarrell@Dashonic.com",
    projects: 136,
    tags: ["Php", "Javascript"],
  },
  {
    id: 9,
    img: avatar9,
    name: "Peter Dryer",
    designation: "Web Designer",
    color: "primary",
    email: "PeterDryer@Dashonic.com",
    projects: 125,
    tags: ["Html", "Css", "illustrator"],
  }
];
const userProfile: Object = {
  id: 1,
  name: "Cynthia Price",
  designation: "UI/UX Designer",
  img: "avatar1",
  projectCount: 125,
  revenue: 1245,
  personalDetail:
    "Hi I'm Cynthia Price,has been the industry's standard dummy text To an English person, it will seem like simplified English, as a skeptical Cambridge.",
  phone: "(123) 123 1234",
  email: "cynthiaskote@gmail.com",
  location: "California, United States",
  experiences: [
    {
      id: 1,
      iconClass: "bx-server",
      link: "#",
      designation: "Back end Developer",
      timeDuration: "2016 - 19",
    },
    {
      id: 2,
      iconClass: "bx-code",
      link: "#",
      designation: "Front end Developer",
      timeDuration: "2013 - 16",
    },
    {
      id: 3,
      iconClass: "bx-edit",
      link: "#",
      designation: "UI /UX Designer",
      timeDuration: "2011 - 13",
    },
  ],
  projects: [
    {
      id: 1,
      name: "Skote admin UI",
      startDate: "2 Sep, 2019",
      deadline: "20 Oct, 2019",
      budget: "$506",
    },
    {
      id: 2,
      name: "Skote admin Logo",
      startDate: "1 Sep, 2019",
      deadline: "2 Sep, 2019",
      budget: "$94",
    },
    {
      id: 3,
      name: "Redesign - Landing page",
      startDate: "21 Sep, 2019",
      deadline: "29 Sep, 2019",
      budget: "$156",
    },
    {
      id: 4,
      name: "App Landing UI",
      startDate: "29 Sep, 2019",
      deadline: "04 Oct, 2019",
      budget: "$122",
    },
    {
      id: 5,
      name: "Blog Template",
      startDate: "05 Oct, 2019",
      deadline: "16 Oct, 2019",
      budget: "$164",
    },
    {
      id: 6,
      name: "Redesign - Multipurpose Landing",
      startDate: "17 Oct, 2019",
      deadline: "05 Nov, 2019",
      budget: "$192",
    },
    {
      id: 7,
      name: "Logo Branding",
      startDate: "04 Nov, 2019",
      deadline: "05 Nov, 2019",
      budget: "$94",
    },
  ],
};
export { users, userProfile };