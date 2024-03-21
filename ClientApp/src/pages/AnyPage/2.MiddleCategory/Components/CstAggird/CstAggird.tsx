import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, NewValueParams } from "ag-grid-community";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  rowDataProps: any[];
  columnDefs: ColDef[];
}

const CstAggird = forwardRef(
  ({ rowDataProps, columnDefs }: Props, ref: any) => {
    const [rowData, setRowData] = useState<any[]>([]);

    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
      setRowData(rowDataProps);
    }, [rowDataProps]);

    const getRowStyle = useCallback((params: any) => {
      if (params.data.operationYn === 1) {
        return {
          backgroundColor: "#54e3461a",
          borderBottom: "1px solid #54e34680",
        };
      }
    }, []);

    return (
      <div
        className="ag-theme-alpine-dark"
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
          headerHeight={54}

          //getRowStyle={getRowStyle}
        />
      </div>
    );
  }
);
export default CstAggird;
