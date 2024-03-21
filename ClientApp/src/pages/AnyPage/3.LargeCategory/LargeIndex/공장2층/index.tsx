import { useEffect } from "react";
import myStyle from "../LargeIndex.module.scss";
import print from "../../../../../assets/images/overview.png";
import { useNavigate } from "react-router-dom";
import RoomLayout from "../RoomLayout";

interface Props {
  twoFactory: any[];
}

export default ({ twoFactory }: Props) => {
  return (
    <div
      style={{
        background: `url(${print}) no-repeat center`,
        backgroundSize: "contain",
      }}
      className={myStyle.map}
    >
      <RoomLayout
        name="레이저"
        position={{
          top: "51px",
          left: "481px",
          width: "55px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1000")}
      />
      <RoomLayout
        name="IR"
        position={{
          top: "51px",
          left: "613px",
          width: "81px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1008")}
      />
      <RoomLayout
        name="표면처리"
        position={{
          top: "51px",
          left: "696px",
          width: "181px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1010")}
      />
      <RoomLayout
        name="PSR"
        position={{
          top: "51px",
          left: "878px",
          width: "77px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1010")}
      />
      <RoomLayout
        name="HP"
        position={{
          top: "51px",
          left: "1008px",
          width: "246px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1011")}
      />
      <RoomLayout
        name="가접"
        position={{
          top: "51px",
          left: "1255px",
          width: "55px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1011")}
      />
      <RoomLayout
        name="AOI"
        position={{
          top: "51px",
          left: "1311px",
          width: "41px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1006")}
      />
      <RoomLayout
        name="센서"
        position={{
          top: "51px",
          left: "1353px",
          width: "36px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1007")}
      />
      <RoomLayout
        name="동도금"
        position={{
          top: "317px",
          left: "729px",
          width: "316px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1001")}
      />
      <RoomLayout
        name="동도금"
        position={{
          top: "317px",
          left: "729px",
          width: "316px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1001")}
      />
      <RoomLayout
        name="전처리"
        position={{
          top: "317px",
          left: "1046px",
          width: "44px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1002")}
      />
      <RoomLayout
        name="노광"
        position={{
          top: "317px",
          left: "1091px",
          width: "142px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1004")}
      />
      <RoomLayout
        name="에칭"
        position={{
          top: "317px",
          left: "1253px",
          width: "137px",
          height: "247px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1005")}
      />
    </div>
  );
};
