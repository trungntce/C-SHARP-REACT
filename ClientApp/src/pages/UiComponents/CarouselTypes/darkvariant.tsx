import React, { useState } from "react";
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
} from "reactstrap";

// Carousel images
import img9 from "../../../assets/images/small/img-9.jpg";
import img7 from "../../../assets/images/small/img-7.jpg";
import img8 from "../../../assets/images/small/img-8.jpg";

const items = [
    {
        src: img9,
        altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        caption: "First slide label",
    },
    {
        src: img7,
        altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        caption: "Second slide label",
    },
    {
        src: img8,
        altText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        caption: "Third slide label",
    },
];

const Darkvariant = () => {
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

    const goToIndex = (newIndex: number) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map(item => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img src={item.src} className="d-block img-fluid" alt={item.altText} />
                <div className="carousel-caption d-none d-md-block">
                    <h5>{item.caption}</h5>
                    <p>{item.altText}</p>
                </div>
            </CarouselItem>
        );
    });

    return (
        <React.Fragment>
            <Carousel className="carousel-dark" activeIndex={activeIndex} next={next} previous={previous}>
                <CarouselIndicators
                    items={items}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                />
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

export default Darkvariant;
