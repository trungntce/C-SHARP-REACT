import { AgGridReact } from "ag-grid-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import { useGridRef } from "../../../../common/hooks";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { ENIGNiChartGridDefs } from "./ENIGNiChartGridDefs";

const ENIGNiGrid = forwardRef((props: any, ref: any) => {
  const [items, setItems] = useState<Dictionary[]>([]);

  const [gridRef, setList] = useGridRef();
  const [changesList, setChangesList] = useState<any>({});

  useImperativeHandle(ref, () => ({
    setItems,
    getItems: () => items,
    getChangeList : () => Object.values(changesList),
    setList : ()=> getData()
  }));

  const getData = async () => {
    setList([]);
    if (items.length > 0) {
      const res = await api<any>("post", "enig/getnglist", {
        list: JSON.stringify(items),
      });

      setList(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, [items]);

  const handleCellValueChanged = useCallback(
    (e: any) => {
      const _key = `${e.data["eqcode"]}${e.data["minDt"]}`;
      setChangesList({
        ...changesList,
        [_key]: e.data,
      });
    },
    [changesList]
  );

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
      <AgGridReact
        ref={gridRef}
        columnDefs={ENIGNiChartGridDefs}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></span>'
        }
        onGridReady={() => setList([])}
        suppressRowClickSelection={true}
        singleClickEdit={true}
        stopEditingWhenCellsLoseFocus={true}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
  );
});
export default ENIGNiGrid;
