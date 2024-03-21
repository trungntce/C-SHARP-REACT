import { Row, Col } from "reactstrap";
import { RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./MessengerUserDefs";
import { columnDefs as groupColumnDefs } from "./MessengerUsergroupDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../common/api";
import ListBase from "../../../components/Common/Base/ListBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { useGridRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";

const MessengerUserList = () => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const [gridRef, setList] = useGridRef();
  const [groupGridRef, setGroupList] = useGridRef();

  const searchHandler = async (_?: Dictionary) => {
    api<Dictionary[]>("get", "messenger/getusergroup", {}).then(result => {
      if(result.data) {
        const list : Dictionary[] = result.data;
        setGroupList(list)
      }
    });
  };

  const userSearchHandler = async (pushTypeId : string) => {
    api<Dictionary[]>("get", "messenger/getuserbygroup", {pushTypeId : pushTypeId}).then(result => {
      if(result.data){
        const list: Dictionary[] = result.data;
        console.log(list)
        setList(list);
      }
    });
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    userSearchHandler(e.data.pushTypeId);
  }

  return (
    <>      
      <ListBase
				buttons = { 
					<>
					</>
				}
        folder="System Management"
        title="User"
        postfix="Management"
        icon="user-plus"
        ref={listRef}
        showPagination={true}>
          <Row style={{ height: "100%" }}>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={groupGridRef}
                  columnDefs={columnDefs()}
                  onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={groupColumnDefs()}
                />
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default MessengerUserList;
