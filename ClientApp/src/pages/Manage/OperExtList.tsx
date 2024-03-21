import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent, RowClassParams, RowClassRules } from "ag-grid-community";
import { columnDefs, pageContext } from "./OperExtDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import Select from "../../components/Common/Select";
import { isNullOrWhitespace } from "../../common/utility";

const OperExtList = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("operext", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;
      setList(list);
    }
  };

  useEffect(() => {
    searchHandler();
  }, []);

  pageContext.saveHandler = async (data: Dictionary) => {
    if(data.createUser){
      const result = await post(data);
      if(result.data > 0){
        searchHandler();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      const result = await put(data);
      if(result.data > 0){
        searchHandler();
        alertBox("등록이 완료되었습니다.");
      }else if(result.data == -1){
        alertBox(`동일한 항목이 존재합니다.<br />공정코드: ${data.operationCode}`);
      }
    }
  };

  pageContext.deleteHandler = (data: Dictionary) => {
    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(data);
      if(result.data > 0){
        searchHandler();
        alertBox("@DELETE_COMPLETE");
      }
    }, async () => {

    });    
  };

  const rowClassRules = useMemo<RowClassRules>(() => {
    return {
      'row-data-exists': (params: RowClassParams) => {
        return !isNullOrWhitespace(params.data.createUser);
      },
      'row-disable-container': (param: RowClassParams) => { 
        return param.data.operYn == 'N' || !param.data.operYn;
      },
    };
  }, []);

  return (
    <>
      <ListBase
        editHandler={() => { setForm({}); }}
        folder="System Management"
        title="OperExt"
        postfix="Management"
        icon="bold"
        ref={listRef}
        buttons={[]}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                {/* 공정코드 */}
                <AutoCombo name="operationCode" sx={{ minWidth: 170 }} placeholder={t("@COL_OPERATION_CODE")} mapCode="operext" />
              </Col>
              <Col>
                {/* 공정명 */}
                <Input name="operationDesc" type="text" size={5} style={{ minWidth: 180 }} placeholder={t("@COL_OPERATION_NAME")} className="form-control" />
              </Col>
              <Col>
                {/* 작업단위 */}
                <Select name="workingUom" label={t("@WORK_UNIT")} placeholder={t("@WORK_UNIT")} mapCode="workinguom" className="form-select" />
              </Col>
              <Col>
                <select name="enableFlag" className="form-select">
                  <option value="">{t("@USEYN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
              <Col>
                <Input name="remark" type="text" size={5} style={{ minWidth: 200 }} placeholder={t("@REMARK")} className="form-control" />
              </Col>
              <Col>
                <select name="setupYn" className="form-select" style={{ minWidth: 130 }}>
                  {/* 설정(입력)여부 */}
                  <option value="">{t("@SETTING_YN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>              
          </SearchBase>
        }>
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
            className="ag-grid-groupheader"
            suppressRowClickSelection={true}
            rowClassRules={rowClassRules}
          />
      </ListBase>
    </>
  );
};

export default OperExtList;
