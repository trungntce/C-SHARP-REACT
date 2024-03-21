import { ReactNode } from "react";
import myStyle from "./Indexer.module.scss";

interface Props {
  currentNum: number;
  itemNum: number;
  eqpName: string;
  children: React.ReactNode;
}

const Indexer = ({ currentNum, itemNum, eqpName, children }: Props) => {
  return (
    <div
      className={myStyle.layout}
      style={{
        width: `${currentNum === itemNum ? "50px" : ""}`,
        border: `${currentNum === itemNum ? "1px solid yellow" : ""}`,
        opacity: `${currentNum === itemNum ? 1 : ""}`,
      }}
    >
      <div
        className={myStyle.iconStyle}
        style={{
          fontWeight: `${currentNum === itemNum ? "bold" : ""}`,
        }}
      >
        {children}
      </div>
      <div className={myStyle.titleStyle}>{eqpName}</div>
    </div>
  );
};

export default Indexer;
