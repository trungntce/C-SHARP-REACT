import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Input, Label, Card, CardBody, Form, InputGroup, InputGroupText, Table, CardHeader } from "reactstrap";
import { resourceLimits } from "worker_threads";
import { setFormData, useApi, useSubmitHandler } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import myStyle from "./MenuEdit.module.scss";

const MenuAuthEdiit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  
  const initRow = useRef<Dictionary>({});

  const groupComboRef = useRef<any>();
  const userComboRef = useRef<any>();

  const [groupList, setGroupList] = useState<Dictionary[]>([]);
  const [userList, setUserList] = useState<Dictionary[]>([]);

  useImperativeHandle(ref, () => ({ 
    setForm: (row: Dictionary) => {      
      initRow.current = row;

      if(initRow.current.menuId){
        searchHandler();
      }
    }
  }));

  const searchHandler = async () => {
    const result = await refetch();
    if(result.data){
      const groupList = result.data.filter((x: Dictionary) => x.targetType == 'G');
      const userList = result.data.filter((x: Dictionary) => x.targetType == 'U');

      setGroupList(groupList);
      setUserList(userList);
    }
  }

  const { refetch, put, del } = useApi("menuAuth", () => {
    return { menuId: initRow.current.menuId }
  }); 

  const addHandler = async (ref: any, targetType: 'G' | 'U') => {
    const item = ref.current.getValue();

    if(!item.value)
      return;

    const data: Dictionary = {
      menuId: initRow.current.menuId,
      targetId: item.value,
      targetType: targetType,
      auth: 15
    }

    const result = await put(data);
    if(result.data && result.data == -1){
      alertBox("이미 추가된 항목입니다.");
      ref.current.setValue({ value: "", label: "" });
      return;
    }

    alertBox("추가되었습니다.");
    ref.current.setValue({ value: "", label: "" });
    searchHandler();
  };

  const delHandler = async (item: Dictionary) => {
    confirmBox("삭제하시겠습니까?", async () => {
      const data: Dictionary = {
        menuId: initRow.current.menuId,
        targetId: item.targetId,
        targetType: item.targetType
      }
  
      const result = await del(data);
      if(result.data && result.data <= 0){
        alertBox("삭제 중 오류가 발생했습니다.");
        return;
      }

      alertBox("삭제되었습니다.");
  
      searchHandler();
    }, async () => {
    });   
  }

  if(!initRow.current.menuId)
    return null;

  return (
    <>
      <Card className="edit-wrap">
        <CardHeader className="gray100">
          권한정보
        </CardHeader>
        <CardBody>
            <Row>
              <Col md={6} className={myStyle.menuAuthWrap}>
                <div className="table-responsive">
                  <Table className="table table-bordered table-fixed table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>그룹ID</th>
                        <th>그룹명</th>
                        <th style={{ width: 40 }}>변경</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="new-row">
                        <th scope="row"></th>
                        <td colSpan={2}>
                          <AutoCombo ref={groupComboRef} name="usergroupId" placeholder="사용자그룹" mapCode="usergroup" />
                        </td>
                        <td className="text-center">
                          <Button type="button" onClick={() => { addHandler(groupComboRef, 'G'); }} className="btn-light btn-link">
                            <i className="fa fa-fw fa-plus" />
                          </Button>                            
                        </td>
                      </tr>
                      {
                        groupList.map((item: Dictionary, index: number) =>
                          (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.targetId}</td>
                              <td>{item.usergroupName}</td>
                              <td className="text-center">
                                <Button type="button" onClick={() => { delHandler(item); }} className="btn-light btn-link">
                                  <i className="fa fa-fw fa-times" />
                                </Button>       
                              </td>
                            </tr>
                          )
                        )
                      }
                    </tbody>
                  </Table>
                </div>               
              </Col>
              <Col md={6} className={myStyle.menuAuthWrap}>
                <div className="table-responsive">
                  <Table className="table table-bordered table-fixed table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>사용자ID</th>
                        <th>사용자명</th>
                        <th>언어</th>
                        <th style={{ width: 40 }}>변경</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="new-row">
                        <th scope="row"></th>
                        <td colSpan={3}>
                          <AutoCombo ref={userComboRef} name="userId" placeholder="사용자" mapCode="user" />
                        </td>
                        <td className="text-center">
                          <Button type="button" onClick={() => { addHandler(userComboRef, 'U'); }} className="btn-light btn-link">
                            <i className="fa fa-fw fa-plus" />
                          </Button>                            
                        </td>
                      </tr>
                      {
                        userList.map((item: Dictionary, index: number) =>
                          (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.targetId}</td>
                              <td>{item.userName}</td>
                              <td>{item.nationCode}</td>
                              <td className="text-center">
                                <Button type="button" onClick={() => { delHandler(item); }} className="btn-light btn-link">
                                  <i className="fa fa-fw fa-times" />
                                </Button>       
                              </td>
                            </tr>
                          )
                        )
                      }
                    </tbody>
                  </Table>
                </div>               
              </Col>
            </Row>
        </CardBody>
      </Card>
    </>
  );
});

export default MenuAuthEdiit;
