import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { columnDefs } from "./HeartbeatDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import * as signalR from "@microsoft/signalr";
import { GetRowIdFunc, GetRowIdParams, RowDataUpdatedEvent } from "ag-grid-community";
import { executeIdle } from "../../common/utility";
import myStyle from "./HeartbeatList.module.scss";
import moment from "moment";
import { useParams } from "react-router-dom";

const HeartbeatList = (props: any) => {
  const { t } = useTranslation();

  const connRef = useRef<any>();
  const dicRef = useRef<Dictionary>({});
  const listRef = useRef<Dictionary[]>([]);
  const newRowData = useRef<Dictionary>({});
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("heartbeat", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();
    const result = await refetch();
    if(result.data && result.data.item1){
      dicRef.current = result.data.item1;
      listRef.current = result.data.item2;

      listRef.current.forEach((x: Dictionary) => {
        x["secAgo"] = calcSec(x.pingDt);
      });

      if(search.statusHealthy != "on"){
        listRef.current = listRef.current.filter((x: Dictionary) => {
          return x["secAgo"] > 60;
        });
      }

      if(search.statusWarning != "on"){
        listRef.current = listRef.current.filter((x: Dictionary) => {
          return x["secAgo"] > 600 || x["secAgo"] <= 60;
        });
      }

      if(search.statusDead != "on"){
        listRef.current = listRef.current.filter((x: Dictionary) => {
          return x["secAgo"] <= 600;
        });
      }

      if(newRowData.current.eqpCode){
        const item = listRef.current.find(x => x.eqpCode == newRowData.current.eqpCode);
        if(item){
          item.pingDt = '0001-01-01';
        }
      }

      setList(listRef.current);
    }
  };

  const calcSec = (pingDt: Date) => {
    const now = moment();
    const dt = moment(pingDt);

    const diff = moment.duration(now.diff(dt));
    return diff.asSeconds();
  }

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.eqpCode;
    };
  }, []);

  useEffect(() => {
    searchHandler();

    connRef.current = new signalR.HubConnectionBuilder()
    .withUrl("/mainHub?group=heartbeatGroup")
    .build();

    connRef.current.on("heartbeat", (eqpCode: string, pingDt: Date) => {
      if(!dicRef.current[eqpCode]){
        newRowData.current = { eqpCode, pingDt };
        searchHandler();
        return;
      }

      const item = listRef.current.find(x => x.eqpCode === eqpCode);
      if(item){
        const rowNode = gridRef.current!.api.getRowNode(eqpCode)!;
        rowNode.setDataValue("pingDt", pingDt);
        rowNode.setDataValue("secAgo", calcSec(pingDt));
      }
    });

    connRef.current.start().then(() => {
    }).catch((err: any) => { 
      console.error(err); 
    });

    setInterval(() => {
      searchHandler();
    }, 30 * 1000);

    return () => {
      connRef.current.off("heartbeat");
      connRef.current.stop();  
    };
  }, []);

  const onRowDataUpdatedHandler = (event: RowDataUpdatedEvent) => {
    if(!newRowData.current.eqpCode)
      return;    

    executeIdle(() => {
      const rowNode = gridRef.current!.api.getRowNode(newRowData.current.eqpCode)!;
      rowNode.setDataValue("pingDt", newRowData.current.pingDt);

      newRowData.current = {};
    });
  }

  return (
    <>      
      <ListBase
        folder="System Management"
        title="Equipment"
        postfix="Monitoring"
        icon="bold"
        buttons={[]}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <AutoCombo name="eqpCode" category="M-005" sx={{ minWidth: "200px" }} placeholder="장비코드" mapCode="eqp" />
              </Col>
              <Col size="auto">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic checkbox toggle button group"
                >
                  <Input
                    type="checkbox"
                    className="btn-check"
                    name="statusHealthy"
                    id="statusHealthy"
                    defaultChecked
                  />
                  <Label className="btn btn-outline-primary" htmlFor="statusHealthy">
                    Healthy
                  </Label>

                  <Input
                    type="checkbox"
                    className="btn-check"
                    name="statusWarning"
                    id="statusWarning"
                    defaultChecked
                  />
                  <Label className="btn btn-outline-warning" htmlFor="statusWarning">
                    Warning
                  </Label>

                  <Input
                    type="checkbox"
                    className="btn-check"
                    name="statusDead"
                    id="statusDead"
                    defaultChecked
                  />
                  <Label className="btn btn-outline-danger" htmlFor="statusDead">
                    Dead
                  </Label>
                </div>
              </Col>
            </Row>
          </SearchBase>
        }>
          <GridBase
            ref={gridRef}
            className={myStyle.heartbeatListContainer}
            getRowId={getRowId}
            onRowDataUpdated={onRowDataUpdatedHandler}
            columnDefs={columnDefs()}
          />
      </ListBase>
    </>
  );
};

export default HeartbeatList;
