import { Row, Col, Button, Input, Label } from "reactstrap";
import { GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs, columnGroupDefs, columnInterlockDefs } from "./SetMessengerDefs";
import { columnDefs as groupColumnDefs } from "./MessengerUsergroupDefs";
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../common/api";
import AutoCombo from "../../../components/Common/AutoCombo";
import ListBase from "../../../components/Common/Base/ListBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";

const SetMessengerList = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const groupOperTypeRef = useRef<any>();
  const groupUserRef = useRef<any>();
  const userRef = useRef<any>();
  const groupmessengerTypeRef = useRef<any>();
  const groupAddRef = useRef<any>();
  const groupDelRef = useRef<any>();

  const [gridRef, setList] = useGridRef();
  const [gridOperRef, setGridOperRef] = useGridRef(); 
  const [gridGroupRef, setGroupList] = useGridRef();

  const [category, setCategory] = useState('G');

  useEffect(() => {
    interlockSearchHandler();
    operTypeSearchHandler();
  }, []);

  const interlockSearchHandler = async (_?: Dictionary) => {
    api<Dictionary[]>("get", "messenger/getinterlock", {}).then(result => {
      if(result.data){
        const list : Dictionary[] = result.data;
        setList(list);
      }
    });
  }

  const operTypeSearchHandler = async (data? : any) => {
    api<Dictionary[]>("get", "messenger/getopertype", data).then(result => {
      if(result.data) {
        const list : Dictionary[] = result.data;
        setGridOperRef(list)
      }
    });
  }

  const groupSearchHandler = async (data : any) => {
    let interlockCode = gridRef.current?.api.getSelectedRows().map(obj => obj['codeId']).join(",")

    api<Dictionary[]>("get", "messenger/getgroupbyoper", {operClassCode : data.opClassCode, operType : data.opTypeCode, interlockCode : interlockCode}).then(result => {
      if(result.data) {
        const list : Dictionary[] = result.data;
        setGroupList(list)
      }
    });
  }

  const selectHandler = (event : React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCategory(value);
  }

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    groupSearchHandler(e.data)
  }

  const onFirstDataRendered = useCallback((params : any) => {
    const nodesToSelect : any[] = [];
    params.api.forEachNode((node : any) => {
      nodesToSelect.push(node);
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  }, []);

  const onOperTypeChange = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => { 
    operTypeSearchHandler({operType : value?.value})
  }

  const groupAddHandler = async () =>{
    const interlock = gridRef.current!.api.getSelectedRows()
    const operType = gridOperRef.current!.api.getSelectedRows()
    
    if (interlock.length <= 0) {
      alertBox(t('@SELECT_INTERLOCK_REASON_CODE'))

      return;
    }

    if (operType.length <= 0) {
      alertBox(t('@MSG_NO_OPERATION_SELECTED'))

      return;
    }

    const userIdDesc = category === 'G' ? groupUserRef.current?.getValue() : userRef.current?.getValue()
    console.log(userIdDesc)

    const messengerCase = groupmessengerTypeRef.current?.getValue()

    console.log(userIdDesc)

    if (!userIdDesc) {
      alertBox(t('@NO_SELECTED_USER_GROUP'))

      return;
    }

    if (!messengerCase) {
      alertBox(t('@NO_SELECTED_MESSENGER_CASE'))

      return;
    }

    api<any>("put", "messenger/insertmessenger", {interlock : interlock, operType : operType, userIdDesc : userIdDesc, messengerCase : messengerCase, userType : category}).then(result => {
      if(result.data > 0) {
        alertBox(`${t('@MSG_REGISTRATION_IS_COMPLETE')}`)

        groupSearchHandler(operType[0])
        return;
      }
      else {
        alertBox(`${t('@MSG_REGISTRATION_IS_FAILED')}`)

        return;
      }
    });
  }

  const groupDelHandler = async () =>{
    const data = gridGroupRef.current!.api.getSelectedNodes().map(obj => obj['data'])
    const operType = gridOperRef.current!.api.getSelectedRows()

    if (data.length <= 0) return;

    confirmBox("삭제하시겠습니까?", async () => {
      api<any>("post", "messenger/deletemessenger", {json : JSON.stringify(data)}).then(result => {
        if(result.data > 0) {
          alertBox(`${t('@DELETE_COMPLETE')}`)
  
          groupSearchHandler(operType[0])
          return;
        }
      });
    }, async () => {

    });       
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
        >
          <Row style={{ height : '5%'}}>
            <Col md={3}>
            {/* Interlock */}
              <>
              </>
            </Col>

            <Col md={3}>
            {/* Oper Type */}
              <div style={{width : '200px'}}>
                <AutoCombo
                  ref={groupOperTypeRef}
                  name='operType'
                  sz={{ maxWidth : 200 }}
                  placeholder={t('@OPER_TYPE')}
                  mapCode="operType"
                  onChange={onOperTypeChange}
                />
              </div>
            </Col>

            <Col md={6}>
            {/* User & Group */}
              <div style={{flexDirection : 'row', display : 'flex', height : '35px'}}>
                <select name="useYn" className="form-select" onChange={selectHandler} style={{width : '100px'}}>
                  <option value="G">{t("@COL_GROUP_CODE")}</option>
                  <option value="U">{t("@USER")}</option>
                </select>

                <div style={{marginLeft : '5px'}}>
                  <AutoCombo
                    ref={groupUserRef}
                    name='messengerUserGroup'
                    sz={{ maxWidth : 200 }}
                    placeholder={t('@USER_GROUP')}
                    mapCode='messengerUserGroup'
                    disabled={category==='U'}
                  /> 
                </div>

                <div style = {{marginLeft : '5px'}}>
                  <AutoCombo
                    ref={userRef}
                    name='messengerUser'
                    sz={{ maxWidth : 200 }}
                    placeholder={t('@USER')}
                    mapCode='messengerUser'
                    disabled={category==='G'}
                  />
                </div>

                <div style={{marginLeft : '5px', width : '30%'}}>
                  <AutoCombo
                    ref={groupmessengerTypeRef}
                    name='messengerType'
                    sz={{ width : '100%' }}
                    placeholder={t('@TYPE')}
                    mapCode="code"
                    category="MESSENGER_TYPE"
                    sx={{ width : '100%' }}
                  />
                </div>

                <div style={{marginLeft : '5px'}}>
                  <Button innerRef={groupAddRef} type="button" color="primary" onClick={groupAddHandler}>
                    <i className="fa fa-fw fa-plus"></i>{" "}
                    {t("@ADD")} {/* 추가 */}
                  </Button>        
                </div>
                
                <div style={{marginLeft : '5px'}}> 
                  <Button innerRef={groupDelRef} type="button" color="light" onClick={groupDelHandler}>
                    <i className="fa fa-fw fa-times"></i>{" "}
                    {t("@DELETE")} {/* 삭제 */}
                  </Button>     
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ height: "90%" }}>
            <Col md={3}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={columnDefs()}
                  rowMultiSelectWithClick={true}
                  rowSelection={'multiple'}
                  onFirstDataRendered={onFirstDataRendered}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridOperRef}
                  columnDefs={columnInterlockDefs()}
                  onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                  rowSelection={'multiple'}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridGroupRef}
                  columnDefs={columnGroupDefs()}
                  rowMultiSelectWithClick={true}
                  rowSelection={'multiple'}
                />
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default SetMessengerList;
