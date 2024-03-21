import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import {
  LinkProps,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import mystyle from "./DrawerPage.module.scss";
import MapIcon from "@mui/icons-material/Map";

interface Props {
  list: any[];
  onSelect: (i: any) => void;
}

const DrawerPage = ({ list, onSelect }: Props) => {
  const nav = useNavigate();
  return (
    <div className={mystyle.layout}>
      <div className={mystyle.listheader}>
        <div style={{ height: "20px", display: "flex" }}>
          {/* <Button
            onClick={() =>
              nav("/anypage/facno/0001", {
                replace: true,
              })
            }
            startIcon={<MapIcon />}
          >
            대분류 이동
          </Button> */}
        </div>
        <div style={{ flex: 1, display: "flex" }}>공정리스트</div>
      </div>
      <div className={mystyle.list}>
        <div className={mystyle.listinner}>
          {list.map((i: any, idx: number) => (
            <div key={idx} className={mystyle.listItemlayout}>
              <div
                onClick={() => onSelect(i)}
                className={mystyle.itemInner}
                style={{
                  letterSpacing: `${i.length > 10 ? "5px" : "10px"}`,
                }}
              >
                {i.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawerPage;
