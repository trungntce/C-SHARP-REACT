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
import { DiGridDefs } from "./DiGridDefs";
import { useGridRef } from "../../../../common/hooks";
import { alertBox } from "../../../../components/MessageBox/Alert";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import { Modal, ModalBody, ModalHeader } from "reactstrap";


const DiGrid = forwardRef((props:any, ref: any) => {
  const [items, setItems] = useState<Dictionary[]>([]);

  const [gridRef, setList] = useGridRef();
  const [changesList, setChangesList] = useState<any>({});

  const [showModal, setShowModal] = useState(false);
  const [modalData,setModalData] = useState("")

  useImperativeHandle(ref, () => ({
    setItems,
    getItems: () => items,
    getChangeList : () => Object.values(changesList),
    setList : ()=> getData()
  }));

  const getData = async () => {
    setList([]);
    if (items.length > 0) {
      const res = await api<any>("post", "diwater/getnglist", {
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
        columnDefs={DiGridDefs}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></span>'
        }
        onGridReady={() => setList([])}
        suppressRowClickSelection={true}
        singleClickEdit={true}
        stopEditingWhenCellsLoseFocus={true}
        onCellValueChanged={handleCellValueChanged}
      />
      {/* <Modal 
        contentClassName="alert-content" 
        toggle={()=>setShowModal(!showModal)} 
        style={{display:"flex",justifyContent:"center",alignContent:"center",height:"auto"}} 
        isOpen={showModal}
        backdrop="static"
      >
        <ModalHeader toggle={()=>setShowModal(!showModal)}>test</ModalHeader>
        <ModalBody>{modalData}</ModalBody>
      </Modal> */}
    </div>
  );
});
export default DiGrid;
