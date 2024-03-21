import { AgGridReact } from "ag-grid-react"
import { useGridRef } from "../../../common/hooks";
import { ColDef } from "ag-grid-community";
import { forwardRef } from "react";

interface Props {
    title:string;
    columnDefs:ColDef[]
}

const FDCGrid = forwardRef(({ columnDefs, title }:Props, ref:any) => {
    return (
        <div
            className={"ag-theme-alpine-dark"}
            style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            }}
      >
        <div style={{ width:"100%", height:"35px", backgroundColor:"#337ccfb3", fontWeight:"400", letterSpacing:"5px",display:"flex", justifyContent:"center", alignItems:"center", fontSize:"1.5rem",marginBottom:"3px" }}>{title}</div>
        <div style={{ width:"100%", height:"100%" }}>
            <AgGridReact
            ref={ref}
            columnDefs={columnDefs}
            overlayLoadingTemplate={
             '<span class="ag-overlay-loading-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></span>'
            }
            stopEditingWhenCellsLoseFocus={true}
            />
        </div>
      </div>
    )
});

export default FDCGrid;