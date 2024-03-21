import img1 from "../../assets/images/small/img-1.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

interface GalleryProps {
    id : number;
    title : string;
    author : string;
    category: Array<any>;
    image: string
}

const GalleryData : Array<GalleryProps> = [
    {
        id: 1,
        title: "Morning photoshoot",
        author: "Scott Finch",
        category: ["project","designing","development"],
        image: img1
    },
    {
        id: 2,
        title: "Drawing a sketch",
        author: "Clarence Smith",
        category: ["photography"],
        image: img4
    },
    {
        id: 3,
        title: "Coffee with Friends",
        author: "Delores Williams",
        category: ["project","development"],
        image: img7
    },
    {
        id: 4,
        title: "Beautiful Day with Friends",
        author: "Keith McCoy",
        category: ["project","designing"],
        image: img3
    },
    {
        id: 5,
        title: "Lorem ipsum Dummy text",
        author: "Silvia Martinez",
        category: ["project","designing"],
        image: img5
    },
    {
        id: 6,
        title: "Project discussion with team",
        author: "Patsy Waters",
        category: ["photography"],
        image: img6
    },
];

export { GalleryData };