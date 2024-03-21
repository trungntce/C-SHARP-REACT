import { ColDef } from "ag-grid-community"


export const FDCInterlockDefs = ():ColDef[] => {
    return [
        {
            headerName:"모델명",
            field:"modelName",
            resizable:true,
            minWidth:200,
            width:200
        },
        {
            headerName:"설명",
            field:"description",
            resizable:true,
            minWidth:200,
            width:200
        },
        {
            headerName:"사유-자동",
            field:"auto",
            resizable:true,
            minWidth:200,
            width:200
        },
        {
            headerName:"시작공순",
            field:"startOperation",
            resizable:true,
            minWidth:200,
            width:200
        },
        {
            headerName:"종료공순",
            field:"endOpration",
            resizable:true,
            minWidth:200,
            width:200
        },
        {
            headerName:"LOT NO",
            field:"lotNo",
            resizable:true,
            minWidth:200,
            width:200
        },
    ]
}

