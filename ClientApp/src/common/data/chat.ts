/**
 * import user images
 */
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";

const chats : Object = [
  {
    id: 1,
    roomId: 1,
    status: "online",
    image: avatar2,
    name: "Daniel Pickering",
    description: "Hey! there I'm available",
    time: "02 min",
  },
  {
    id: 2,
    roomId: 2,
    status: "online",
    image: "Null",
    nameimg : "H",
    color: "success",
    name: "Helen Harper",
    description: "I've finished it! See you so",
    time: "12 min",
  },
  {
    id: 3,
    roomId: 3,
    status: "away",
    image: avatar3,
    name: "Mary Welch",
    description: "This theme is awesome!",
    time: "22 min",
  },
  {
    id: 4,
    roomId: 4,
    status: "",
    image: avatar4,
    name: "Vicky Garcia",
    description: "Nice to meet you",
    time: "01 Hr",
  },
  {
    id: 5,
    roomId: 5,
    status: "online",
    image: "Null",
    nameimg : "S",
    color: "primary",
    name: "Scott Pierce",
    description: "Wow that's great",
    time: "04 Hrs",
  },
  {
    id: 7,
    roomId: 7,
    status: "online",
    image: "Null",
    nameimg : "R",
    color: "primary",
    name: "Ray Little",
    description: "Hey! there I'm available",
    time: "10 Hrs",
  },
  {
    id: 8,
    roomId: 8,
    status: "online",
    image: "Null",
    nameimg : "R",
    color: "primary",
    name: "Robert Perez",
    description: "Thanks",
    time: "yesterday",
  },
  {
    id: 9,
    roomId: 9,
    status: "away",
    image: avatar3,
    name: "Mary Welch",
    description: "This theme is awesome!",
    time: "22 min",
  },
];

const groups: Object = [
  { id: 1, image: "G", name: "General" },
  { id: 2, image: "R", name: "Reporting" },
  { id: 3, image: "M", name: "Meeting" },
  { id: 4, image: "A", name: "Project A" },
  { id: 5, image: "B", name: "Project B" },
];

const contacts: Object = [
  {
    category: "A",
    child: [
      { id: 1, name: "Adam Miller" },
      { id: 2, name: "Alfonso Fisher" },
    ],
    image: "A"
  },
  {
    category: "B",
    child: [{ id: 1, name: "Bonnie Harney" }],
  },
  {
    category: "C",
    child: [
      { id: 1, name: "Charles Brown" },
      { id: 2, name: "Carmella Jones" },
      { id: 3, name: "Carrie Williams" },
    ],
    image: "C"
  },
  {
    category: "D",
    child: [{ id: 4, name: "Dolores Minter" }],
    image: "D"
  },
];

const messages = [
  {
    id: 1,
    roomId: 1,
    sender: "Henry Wells",
    message: "Hello!",
    createdAt: "2020-04-02T17:00:21.529Z",
  },
  {
    id: 2,
    roomId: 1,
    sender: "Henry Wells",
    message: "How are you ?",
    createdAt: "2020-04-02T17:01:21.529Z",
  },
  {
    id: 3,
    roomId: 1,
    sender: "Steven Franklin",
    message: "I am fine, What about you ?",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 4,
    roomId: 2,
    sender: "Adam Miller",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 5,
    roomId: 3,
    sender: "Keith Gonzales",
    message: "How are you ?",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 6,
    roomId: 4,
    sender: "Jose Vickery",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 7,
    roomId: 5,
    sender: "Mitchel Givens",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 8,
    roomId: 6,
    sender: "Stephen Hadley",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 9,
    roomId: 7,
    sender: "Keith Gonzales",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 10,
    roomId: 8,
    sender: "Adam Miller",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 11,
    roomId: 9,
    sender: "Jose Vickery",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 12,
    roomId: 10,
    sender: "Keith Gonzales",
    message: "Next meeting tomorrow 10.00AM",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 13,
    roomId: 11,
    sender: "Jennie Sherlock",
    message: "Hello!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
  {
    id: 14,
    roomId: 11,
    sender: "Jennie Sherlock",
    message: "What about our next meeting?!",
    createdAt: "2020-04-02T17:07:21.529Z",
  },
];

export { chats, messages, contacts, groups };
