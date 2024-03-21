import { Drawer, IconButton } from "@mui/material";
import DrawerPage from "../Components/DrawerPage/DrawerPage";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import myStyle from "./LargeIndex.module.scss";
import { ReactNode, useEffect, useRef, useState } from "react";
import CustomMui from "../../scss/CustomMui";
import AlarmLayout from "../../AlarmLayout/AlarmLayout";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import FactoryOneF from "./공장1층";
import FactoryThoF from "./공장2층";
import api from "../../../../common/api";
import { useNavigate } from "react-router-dom";

const LargeIndex = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);

  const nav = useNavigate();

  useEffect(() => {
    const res = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/largecontents",
        {}
      );
      if (data) {
        setItems([
          <FactoryOneF
            oneFactory={[...data].filter((i: any) => i.fac_no === "0001")}
            twoFactory={[...data].filter((i: any) => i.fac_no === "0002")}
          />,
          <FactoryThoF
            twoFactory={[...data].filter((i: any) => i.fac_no === "0003")}
          />,
        ]);
      }
    };
    res();
  }, []);

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

  const slides = items.map((i: ReactNode, idx: number) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        {i}
      </CarouselItem>
    );
  });

  return (
    <div className={myStyle.layout}>
      <AlarmLayout list={[]}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className={myStyle.maplayout}>
            <Carousel
              interval={10000}
              activeIndex={activeIndex}
              next={next}
              previous={previous}
            >
              {slides}
              <CarouselControl
                className="bg-black"
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
              />
              <CarouselControl
                className="bg-black"
                direction="next"
                directionText="Next"
                onClickHandler={next}
              />
            </Carousel>
          </div>
          <div className={myStyle.charts}></div>
        </div>
      </AlarmLayout>
    </div>
  );
};

export default LargeIndex;
