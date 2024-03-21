import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import myStyle from "./NoticeList.module.scss";
import { useRecoilValue } from "recoil";
import { EquipMentList, EquipStatus } from "../../StateStore/EquipMentList";
import { IconButton } from "@mui/material";
import WestIcon from "@mui/icons-material/West";

const NoticeList = () => {
  const { facno, roomname, eqptype } = useParams();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  const eqpList = useRecoilValue(EquipStatus);
  const nav = useNavigate();

  const [items, setItems] = useState([]);

  useEffect(() => {
    const dddd = [...eqpList]?.filter((f: any) => f.eqpType === eqptype)[0];
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

  const slides = items.map((i: string, idx: number) => {
    return (
      <CarouselItem
        className="font-size-20"
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ marginTop: "10px" }}>{i}</p>
        </div>
      </CarouselItem>
    );
  });

  return (
    <div className={myStyle.container}>
      <div className="d-none d-lg-block">
        <div className={myStyle.left}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => nav(-1, { replace: true })}
              sx={{ color: "white" }}
            >
              <WestIcon />
            </IconButton>
          </div>
          <div
            style={{
              flex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {`${
            [...eqpList]?.filter((f: any) => f.eqpType === eqptype)[0]
              ?.eqptypeDes
          }`}</div>
        </div>
      </div>
      <div className={myStyle.noticeList}>
        <div className={myStyle.header}>공지 리스트</div>
        <div className={myStyle.list}>
          <Carousel
            interval={15000}
            style={{ height: "100%" }}
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
      </div>
    </div>
  );
};

export default NoticeList;
