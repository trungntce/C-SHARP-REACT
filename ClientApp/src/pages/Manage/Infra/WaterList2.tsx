import { Dictionary } from "../../../common/types";
import { Row, Col, Button, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { waterColumnDefs } from "./WaterDefs";
import { useEffect, useState } from "react";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, AreaChart, Area, ResponsiveContainer, ReferenceLine } from "recharts";
import myStyle from "./WaterList2.module.scss";
import myImage from "../../../assets/water.png";
import myBg from "../../../assets/bg.png";

const WaterList = () => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch } = useApi("diwater", getSearch, gridRef); 
  const [filteredData, setFilteredData] = useState([]);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data.filter((e: any) => e.toResistVal < 12));

    let dataArray: any = [];
    const modelNames = [...new Set(result.data.map((e: { modelId: any }) => e.modelId))];
    modelNames.map((name, i) => (dataArray[i] = result.data.filter((data: any) => data.modelId === name)));
    setFilteredData(dataArray);
  };

  useEffect(() => {
    searchHandler();
  }, []);
  const tickFormatter = (timeStr: any) => {
    const hour = timeStr.slice(11, 16);
    return hour;
  };
  return (
    <>
      <ListBase
        folder="INFRA Monitoring"
        title="DI Water"
        postfix="Conductivity 현황 관리"
        icon="bold"
        buttons
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                <Input name="startDt" type="datetime-local" className="form-control" size={5} style={{ width: 190 }} placeholder="시작시간" defaultValue={"2023-03-01 01:00"} />
              </Col>
              <Col size="auto">
                <Input name="endDt" type="datetime-local" className="form-control" size={5} style={{ width: 190 }} placeholder="종료시간" defaultValue={"2023-03-01 10:00"} />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <div className={myStyle.top}>
          {filteredData.map((data: any) => (
            <div className={myStyle.chartTab}>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart
                  width={500}
                  height={150}
                  data={data}
                  syncId="anyId"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="createDt" tickFormatter={tickFormatter} />
                  <YAxis
                    //tick={{ fill: "white" }}
                    label={{ value: "Ω", offset: 5 }}
                    domain={[6, 18]}
                  />
                  <Legend />
                  <Tooltip />
                  <ReferenceLine y={12} stroke="red" />
                  <ReferenceLine y={15} stroke="rgb(200,120,100)" />
                  <Line
                    type="monotone"
                    dataKey="returnResistVal"
                    stroke="rgb(200,200,200)"
                    //fill="rgb(51,205,18)"
                    dot={false}
                    name="AE-107"
                  />
                  <Line
                    type="monotone"
                    dataKey="toResistVal"
                    stroke="rgb(100,150,240)"
                    //fill="rgb(100,150,240)"
                    dot={false}
                    name="AE-108"
                  />
                  {/* <Brush height={8} /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
        <div
          className={myStyle.bottom}
          style={{
            backgroundImage: `url(${myBg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div className={myStyle.body}>
            {filteredData.map((data: any) => (
              <div className={myStyle.nemo}>
                {/* <div className={myStyle.nemoTitle}>
                  MODEL: <>{data[0]?.modelId}</>
                </div> */}
                <div className={myStyle.imgTab}>
                  <div className={myStyle.text1}>AE-107 | {data[data.length - 1]?.returnResistVal} MΩ</div>
                  <div className={myStyle.text2}>AE-108 | {data[data.length - 1]?.toResistVal} MΩ</div>
                  <div className={myStyle.text3}>
                    MODEL: <>{data[0]?.modelId}</>
                  </div>
                  <div className={myStyle.text4}>TANK-103</div>
                  <div className={myStyle.text5}>P-106A/B</div>
                  <div className={myStyle.text6}>MBP-101A-D</div>
                  <img src={myImage} alt="My Image" className={myStyle.image} />
                </div>
              </div>
            ))}
            <div className={myStyle.lastNemo}>
              <div className={myStyle.modelText}>NG 목록 조회</div>
              <GridBase ref={gridRef} columnDefs={waterColumnDefs} />
            </div>
          </div>
        </div>
      </ListBase>
    </>
  );
};

export default WaterList;
