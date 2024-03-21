import { AgGridReact } from "ag-grid-react";
import { forwardRef } from "react";
import { baseColDef } from "./DefBase";

const GridBase = forwardRef((props: any, ref: any) => {
  const { style, className, ...rest } = props;
  return (
    <div className={ `ag-theme-alpine mb-2 ${className}` } id={props.containerId} style={{ width: "100%", height: "100%", ...style }}>
      <AgGridReact
        ref={ref}
        headerHeight={37}
        rowHeight={35}
        rowSelection={props.rowSelection || "single"}
        enableCellTextSelection={true}
        rowMultiSelectWithClick={true}
        defaultColDef={baseColDef}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></span>'
        }
        {...rest}
      />
    </div>
  );
});

export default GridBase;
