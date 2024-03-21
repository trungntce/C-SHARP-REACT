import mystyle from "./DrawerPage.module.scss";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Props {
  list: any[];
  onSelect: () => void;
}

type TreeItemProps = {
  parant: string;
  children: TreeItemProps[];
};

const DrawerPage = ({ list, onSelect }: Props) => {
  return (
    <div className={mystyle.layout}>
      <div className={mystyle.listheader}>공장리스트</div>
      <div className={mystyle.list}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{
            height: "100%",
            flexGrow: 1,
            maxWidth: "98%",
            overflowY: "auto",
          }}
        >
          <TreeItem
            sx={{
              margin: "0.5rem 0px",
              "& .MuiTreeItem-label": {
                fontSize: "2rem", // Adjust the font size as desired
              },
            }}
            nodeId="1"
            label="1공장"
          >
            <TreeItem nodeId="2" label="1층" onClick={onSelect} />
          </TreeItem>
          <TreeItem nodeId="5" label="2공장">
            <TreeItem nodeId="10" label="1층" onClick={onSelect} />
            <TreeItem nodeId="6" label="2층" onClick={onSelect} />
          </TreeItem>
        </TreeView>
      </div>
    </div>
  );
};

export default DrawerPage;

const CommonTreeItem = (test: TreeItemProps[]) => {
  return test.map((i: TreeItemProps) => <TreeItem nodeId={""}></TreeItem>);
};
