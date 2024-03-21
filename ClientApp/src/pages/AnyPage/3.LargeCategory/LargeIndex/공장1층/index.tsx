import { useEffect } from "react";
import myStyle from "../LargeIndex.module.scss";
import print from "../../../../../assets/images/onefactory.png";
import RoomLayout from "../RoomLayout";

interface Props {
  oneFactory: any[];
  twoFactory: any[];
}

export default ({ oneFactory, twoFactory }: Props) => {
  return (
    <div
      style={{
        background: `url(${print}) no-repeat center`,
        backgroundSize: "contain",
      }}
      className={myStyle.map}
    >
      <RoomLayout
        name="SDC 1"
        position={{
          top: "59px",
          left: "334px",
          width: "25px",
          height: "74px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1014")}
      />
      <RoomLayout
        name="BBT"
        position={{
          top: "152px",
          left: "282px",
          width: "53px",
          height: "128px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1013")}
      />
      <RoomLayout
        name="PRESS"
        position={{
          top: "96px",
          left: "45px",
          width: "144px",
          height: "91px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1011")}
      />
      <RoomLayout
        name="AUTOMOUNT"
        position={{
          top: "96px",
          left: "198px",
          width: "75px",
          height: "191px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1000")}
      />
      <RoomLayout
        name="PLASMA"
        position={{
          top: "196px",
          left: "156px",
          width: "32px",
          height: "91px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1015")}
      />
      <RoomLayout
        name="HOTPRESS"
        position={{
          top: "196px",
          left: "46px",
          width: "110px",
          height: "90px",
        }}
        items={oneFactory.filter((f: any) => f.room_name === "1011")}
      />
      <RoomLayout
        name="레이저"
        position={{
          top: "59px",
          left: "459px",
          width: "54px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1000")}
      />
      <RoomLayout
        name="IR"
        position={{
          top: "59px",
          left: "590px",
          width: "78px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === null)}
      />
      <RoomLayout
        name="표면처리"
        position={{
          top: "59px",
          left: "670px",
          width: "180px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1010")}
      />
      <RoomLayout
        name="PSR"
        position={{
          top: "59px",
          left: "851px",
          width: "80px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1009")}
      />
      <RoomLayout
        name="HP"
        position={{
          top: "59px",
          left: "932px",
          width: "291px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1011")}
      />
      <RoomLayout
        name="AOI"
        position={{
          top: "59px",
          left: "1224px",
          width: "51px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1006")}
      />
      <RoomLayout
        name="센서"
        position={{
          top: "59px",
          left: "1276px",
          width: "81px",
          height: "240px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1007")}
      />

      <RoomLayout
        name="동도금"
        position={{
          top: "318px",
          left: "704px",
          width: "309px",
          height: "243px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1001")}
      />
      <RoomLayout
        name="전처리"
        position={{
          top: "318px",
          left: "1014px",
          width: "47px",
          height: "243px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1002")}
      />
      <RoomLayout
        name="노광"
        position={{
          top: "318px",
          left: "1062px",
          width: "157px",
          height: "243px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1004")}
      />
      <RoomLayout
        name="에칭"
        position={{
          top: "318px",
          left: "1220px",
          width: "135px",
          height: "243px",
        }}
        items={twoFactory.filter((f: any) => f.room_name === "1005")}
      />
    </div>
  );
};
