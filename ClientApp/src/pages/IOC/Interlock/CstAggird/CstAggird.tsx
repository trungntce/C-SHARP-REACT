import { AgGridReact } from "ag-grid-react";
import "./ag-theme-cst.scss";
import { ColDef, NewValueParams } from "ag-grid-community";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  rowDataProps: any[];
  columnDefs: ColDef[];
  eventHandle?: (e: any) => void;
}

const CstAggird = forwardRef(
  ({ rowDataProps, columnDefs, eventHandle }: Props, ref: any) => {
    const [rowData, setRowData] = useState<any[]>([]);

    useEffect(() => {
      setRowData(rowDataProps);
    }, [rowDataProps]);

    const getRowStyle = useCallback((params: any) => {
      if (params.data.operationYn === 1) {
        return {
          backgroundColor: "#49FF004d",
        };
      } else if (params.data.operationYn === 0) {
        return {
          backgroundColor: "#ffe5694d",
        };
      } else if (params.data.operationYn === -1) {
        return {
          backgroundColor: "#FF17004d",
        };
      } else if (params.data.operationYn === -2) {
        return {
          backgroundColor: "#8080804d",
        };
      }
    }, []);

    return (
      <div
        className="ag-theme-custom-name"
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <AgGridReact
          ref={ref}
          rowData={[...rowData]}
          columnDefs={columnDefs}
          alwaysShowVerticalScroll={true}
          suppressScrollOnNewData={true}
          headerHeight={40}
          onCellMouseOver={eventHandle}
          onCellMouseOut={eventHandle}
          getRowStyle={getRowStyle}
        />
      </div>
    );
  }
);
export default CstAggird;
