import { forwardRef, useRef } from "react";
import { Col, Row } from "reactstrap";
import { useApi, useGridRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import GridBase from "../../../../components/Common/Base/GridBase";
import { useTranslation } from "react-i18next";

const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_CODE"),
      field: "equipmentCode",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_NAME"),
      field: "equipmentDescription",
      flex: 1,
    }
  ]
}

const EqpSelect = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const [gridRef, setList] = useGridRef();
  const { get } = useApi("erpeqp", () => { return {}; } , gridRef);

  const initHandler = async (formRef: any, init: Dictionary) => {
    initRow.current = init;

    const result = await get!(init);

    if(result.data) 
      setList(result.data);
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    const data = gridRef.current?.api.getSelectedRows();

    let eqpList = data?.map(item => item.equipmentCode);

    let result = {...initRow.current?.row , 'eqpCodeList' : eqpList}

    props.onComplete(result); 
  }


  return(
    <EditBase
      ref={ref}
      header="Equipment Set"
      initHandler={initHandler}
      submitHandler={submitHandler}
      size="sm"
    >
      <GridBase
        ref={gridRef}
        columnDefs={columnDefs()}
        style={{ height: "30vh" }}
        rowSelection="multiple"
      />
    </EditBase>
  )
});

export default EqpSelect;