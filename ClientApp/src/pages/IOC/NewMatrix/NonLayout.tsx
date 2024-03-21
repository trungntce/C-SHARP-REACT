import myStyle from "./NewConcept.module.scss";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getMap } from "../../../common/utility";

interface Props {
  roomList: any[];
  onAddHandler: (e: string) => void;
}

export default ({ roomList, onAddHandler }: Props) => {
  //const [roomList, setRoomList] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      //onClick={(e: any) => onAddHandler("1004")}
      className={myStyle.nonlayout}
    >
      <IconButton onClick={handleClick} sx={{ color: "white" }}>
        <AddIcon sx={{ fontSize: "10rem" }} />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {roomList?.map((i: any) => (
          <MenuItem
            onClick={(e: any) => {
              onAddHandler(i.value);
              handleClose();
            }}
            key={i.value}
          >
            {i.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
