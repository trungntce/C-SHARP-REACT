import { Row, Col, Button, Input, Label } from "reactstrap";
import {
  useApi,
  useEditRef,
  useGridRef,
  useSearchRef,
} from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import { ModelDef } from "./StstatueDefs";

const Ststatus = () => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();

  const { refetch, post, put, del } = useApi("stmanager", getSearch, gridRef);
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if (result.data) setList(result.data);
  };

  const groupSearchHandler = async (_?: Dictionary) => {
    // const result = await groupRefetch();
    // if (result.data) {
    //   setGroupList(result.data);
    //   setList([]);
    //   addRef.current.disabled = true;
    //   delRef.current.disabled = true;
    //   groupGridRef.current!.api.deselectAll();
    // }
  };
  return (
    <>
      <ListBase
        buttons={<div></div>}
        search={
          <SearchBase ref={searchRef} searchHandler={groupSearchHandler}>
            <Row>
              <Col>
                <Input
                  name="codegroupId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 150 }}
                  placeholder="코드그룹ID"
                />
              </Col>
              <Col>
                <Input
                  name="codegroupName"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder="코드그룹명"
                />
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">사용여부</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={2} style={{ border: "1px solid blue" }}>
            <GridBase ref={gridRef} columnDefs={ModelDef} />
          </Col>
          <Col md={3} style={{ border: "1px solid yellow" }}></Col>
          <Col style={{ border: "1px solid green" }}>
            <GridBase />
          </Col>
        </Row>
        <Row style={{ height: "100%", border: "1px solid red" }}></Row>
      </ListBase>
    </>
  );
};

export default Ststatus;
