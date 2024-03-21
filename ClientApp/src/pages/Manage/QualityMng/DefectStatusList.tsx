import moment from "moment";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnDefs } from "./DefectStatusDefs";

const DefectStatusList = () => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("defect/status", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data){
      const list: Dictionary[] = result.data;

      setList(list);
    }
  };


  return (
    <>
    <ListBase
      folder="Quality Management"
      title="DefectStatus"
      postfix="불량 등록 현황"
      icon="zap-off"
      buttons={[]}
      search={
        <SearchBase
          ref={searchRef} 
          searchHandler={searchHandler}
        >
          <div className="search-row">
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="fromDt" defaultValue={moment().add(-5, 'days').toDate()} placeholderText="조회시작" required={true} />
            </div>
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
            </div>
          </div>

        </SearchBase>
      }>
        <GridBase 
          ref={gridRef}
          columnDefs={columnDefs}
          alwaysShowHorizontalScroll={true}
          className="ag-grid-bbt"
        />
    </ListBase>

    </>
  )

}
export default DefectStatusList;