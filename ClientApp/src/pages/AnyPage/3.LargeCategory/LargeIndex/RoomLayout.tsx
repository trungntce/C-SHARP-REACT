import { useNavigate } from "react-router-dom";
import myStyle from "./LargeIndex.module.scss";

interface Props {
  name: string;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  items: any[];
}

const RoomLayout = ({ name, position, items }: Props) => {
  const nav = useNavigate();

  return (
    <div
      onClick={() => nav(items[0].url)}
      className={myStyle.roomlayer}
      style={position}
    >
      <div className={myStyle.titlee}>{name}</div>
      <div className={myStyle.eqpcontainer}>
        {items.map((i: any, idx: number) => (
          <div
            key={idx}
            className={`${myStyle.layereqpitem} ${
              i.operation_yn === "0" ? myStyle.layereqpdown : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomLayout;
