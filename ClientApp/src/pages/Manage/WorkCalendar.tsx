import { CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect } from "react";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { columnDefs } from "./WorkCalendarDefs";
import WorkCalendarEdit from "./WorkCalendarEdit";

const WorkCalendar = () => {
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [editRef, setForm, closeModal] = useEditRef();
    const { refetch, post, put, del } = useApi("workcalendar", getSearch, gridRef); 

    const searchHandler = async (_?: Dictionary) => {
        const result = await refetch();
        if(result.data)
          setList(result.data);
    };
    
    useEffect(() => {
        searchHandler();
    }, []);

    const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = { ...initRow, ...row };
        
        if (initRow.workDate) {
            const result = await post(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox("수정이 완료되었습니다.");
            }
        } else {
            const result = await put(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox("작성이 완료되었습니다.");
            } else if (result.data == -1) {
                alert(`동일한 항목이 존재합니다. WorkDate: ${newRow.WorkDate}`);
            }
        }
    };

    const deleteHandler = async () => {
      const rows = gridRef.current!.api.getSelectedRows();
        if(!rows.length){
          alertBox("삭제할 행을 선택해 주세요.");
          return;
        }
    
        confirmBox("삭제하시겠습니까?", async () => {
            const result = await del(rows[0]);
            if(result.data > 0){
                searchHandler();
                alertBox("삭제되었습니다.");
            }
        }, async () => {
        });
    }

    return (
        <>
           <ListBase
                columnDefs={columnDefs}
                editHandler={() => { setForm({}); }}
                deleteHandler={deleteHandler}
                folder="System Management"
                title="WorkCalendar"
                postfix="Management"
                icon="minimize"
                search={
                    <>
                        <SearchBase ref={searchRef} searchHandler={searchHandler}>
                            <div className="search-row">
                                <div style={{ maxWidth: "115px" }}>
                                    <DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />
                                </div>
                                <div style={{ maxWidth: "115px" }}>
                                    <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
                                </div>
                                <div style={{ maxWidth: "130px"}}>
                                    <AutoCombo name="workerId" sx={{ minWidth: "200px" }} placeholder="작업자" mapCode="worker" />
                                </div>
                            </div>
                        </SearchBase>
                    </>
                }>
                <GridBase
                    ref={gridRef}
                    columnDefs={columnDefs}
                    onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                        setForm(e.data);
                    }}
                />
            </ListBase>
            <WorkCalendarEdit ref={editRef} onComplete={editCompleteHandler} />
        </>
    )
}

export default WorkCalendar;