import React, { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl
} from "reactstrap";

// Carousel images
import img1 from "../../../assets/images/small/img-1.jpg";
import img3 from "../../../assets/images/small/img-3.jpg";
import img5 from "../../../assets/images/small/img-5.jpg";

const items = [
  {
    src: img1,
    altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    caption: "First slide label",
  },
  {
    src: img3,
    altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    caption: "Second slide label",
  },
  {
    src: img5,
    altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    caption: "Third slide label",
  },
];

const Slidewithcaption = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = items.map(item => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} className="d-block img-fluid" alt={item.altText} />
        <div className="carousel-caption d-none d-md-block text-white-50">
          <h5 className="text-white">{item.caption}</h5>
          <p>{item.altText}</p>
        </div>
      </CarouselItem>
    );
  });

  return (
    <React.Fragment>
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
    </React.Fragment>
  );
};

export default Slidewithcaption;
