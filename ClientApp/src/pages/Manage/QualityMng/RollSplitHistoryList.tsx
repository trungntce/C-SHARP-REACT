import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import { RowSelectedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { contentType, Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { rollDefs, rollSplitPanelDefs, splitRollDefs } from "./RollSplitHistoryDefs";
import api from "../../../common/api";
import { alertBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import { downloadFile, yyyymmddhhmmss } from "../../../common/utility";
import { useTranslation } from "react-i18next";

const RollSplitHistoryList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [rollRef, setRollList] = useGridRef();
  const [rollSplitRef, setRollSplitList] = useGridRef();
  const [rollPanelMapRef, setRollPanelMapList] = useGridRef();
  const [rollSpliteList, setRollSplit] = useState<Dictionary[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const { refetch } = useApi("rollsplit", getSearch, rollRef);


  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) 
      setRollList(result.data);
      setRollSplitList([]);
      setExpanded([]);
      setRollPanelMapList([]);
  };

  useEffect(()=> {
    searchHandler();
  },[])

  useEffect(() => {
    setExpanded([...["ROOT"], ...(() => rollSpliteList.map(y => y.childId))()]);
  },[rollSpliteList]);

  const rollSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "rollsplit/rollsplittree", e.data).then((result) => {
      if(result.data) {
        setRollSplit(result.data);
        setRollSplitList(result.data);
        setRollPanelMapList([]);
      }
    });
  }

  const rollTreeSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "rollsplit/rollpanel", e.data).then((result) => {
      if(result.data) {
        setRollPanelMapList(result.data);
      }
    });
  }

  function MinusSquare(props: SvgIconProps) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props: SvgIconProps) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare(props: SvgIconProps) {
    return (
      <SvgIcon
        className="mui-treeview-close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }

  const StyledTreeItem = styled((props: TreeItemProps) => (
    <>
      <TreeItem {...props} />
    </>
    ))(({ theme }) => ({
      [`& .${treeItemClasses.iconContainer}`]: {
        '& .mui-treeview-close': {
          opacity: 0.3,
        },
      },
      [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
      },
    }));

  const excelHandler = async(e: any) => {
    e.preventDefault();


    if(rollSplitRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다.
      return;
    }

    if(rollRef.current!.api.getSelectedRows().length <= 0 ) {
      alertBox(t("@MSG_ALRAM_TYPE22")); //선택된 ROLL이 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;
    param.childId = rollRef.current!.api.getSelectedRows()[0].childId;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","rollsplit/rollsplittree",param);
    downloadFile(`ROLL_분할이력_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  return (
    <>
      <ListBase
        folder="Quality Management"
        title="RollSplitHistory"
        postfix="Management"
        icon="anchor"
        buttons={[]}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>  
              </>
            }
          >
            <Row>
              <Col>
                <Input name="rollId" type="text" placeholder="Roll ID" className="form-control" />
              </Col>
              <Col>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-5, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={2}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase 
                ref={rollRef}
                columnDefs={rollDefs()}
                onRowSelected={rollSelectedHandler}
              />
            </div>
          </Col>
          <Col md={4}>
            <TreeView
              className="height100vh-tree"
              expanded={expanded}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
              sx={{ flexGrow: 1, maxWidth: 600, overflowY: 'auto' }}
            >
              <StyledTreeItem nodeId="ROOT" label="Roll">
                {rollSpliteList.filter(x => !x.parentId).map((item, index) => {
                  return (<StyledTreeItem key={item.childId} nodeId={item.childId} label={item.childId}>
                    {rollSpliteList.filter(x => item.childId === x.parentId).map((childItem2, childIndex) => {
                      return (<StyledTreeItem key={childItem2.childId} nodeId={childItem2.childId} label={childItem2.childId}>
                        {rollSpliteList.filter(x => childItem2.childId === x.parentId && item.childId != x.parentId).map((childItem3, childChildIndex) => {
                          return (<StyledTreeItem key={childItem3.childId} nodeId={childItem3.childId} label={childItem3.childId}>
                            {rollSpliteList.filter(x => childItem3.childId === x.parentId && childItem2.childId != x.parentId).map((childItem4, childChildIndex) => {
                              return (<StyledTreeItem key={childItem4.childId} nodeId={childItem4.childId} label={childItem4.childId}>
                                {rollSpliteList.filter(x => childItem4.childId === x.parentId && childItem3.childId != x.parentId).map((childItem5, childChildIndex) => {
                                  return (<StyledTreeItem key={childItem5.childId} nodeId={childItem5.childId} label={childItem5.childId} />)
                                })}
                                </StyledTreeItem>)
                            })}
                          </StyledTreeItem>)
                        })}
                      </StyledTreeItem>)
                    })}
                  </StyledTreeItem>)
                })}
              </StyledTreeItem>
            </TreeView>
          </Col>
          <Col md={6}>
            <Row style={{ height: "50%"}}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase 
                  ref={rollSplitRef}
                  columnDefs={splitRollDefs()}
                  onRowSelected={rollTreeSelectedHandler}
                />
              </div>
            </Row>
            <Row style={{ height: "50%"}}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase 
                  ref={rollPanelMapRef}
                  columnDefs={rollSplitPanelDefs()}
                />
              </div>
            </Row>
          </Col>
        </Row>



      </ListBase>
    </>
  );
}

export default RollSplitHistoryList;