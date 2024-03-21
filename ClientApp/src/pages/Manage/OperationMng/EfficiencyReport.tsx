import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import ListBase from "../../../components/Common/Base/ListBase";
import { Col, Row } from "reactstrap";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { useEffect, useState } from "react";
import GridBase from "../../../components/Common/Base/GridBase";
import api from "../../../common/api";
import { getMap } from "../../../common/utility";
import { useTranslation } from "react-i18next";

const EfficiencyReport = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch, post, put, del } = useApi("", getSearch, gridRef);
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if (result.data) setList(result.data);
  };

  const [title, setTitle] = useState("");

  const [typelist, setTypeList] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    getMap("typelist").then(({ data }: any) => {
      const filter = [...data].reduce((pre: any, cur: any) => {
        pre[cur.parent]
          ? pre[cur.parent].push({
              key: cur.value,
              value: cur.label,
            })
          : (pre[cur.parent] = [cur.label]);
        return pre;
      }, {});
      setTypeList(filter);
    });
  }, []);

  return (
    <ListBase buttons={<div></div>}>
      <Row style={{ height: "100%" }}>
        <Col md={2} style={{ backgroundColor: "rgba(249, 249, 249, 1)" }}>
          <Row
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F0F0F0",
              fontSize: "2rem",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            중분류 ( 유형 )
          </Row>
          <Row
            style={{
              position: "relative",
              width: "100%",
              height: "calc(100% - 120px)",
            }}
          >
            <TreeView
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflowY: "scroll",
              }}
              defaultCollapseIcon={<IndeterminateCheckBoxIcon />}
              defaultExpandIcon={<AddBoxIcon />}
            >
              {Object.entries(typelist).map((i: any, idx: number) => (
                <TreeItem nodeId={`${i[0]}`} label={i[0]}>
                  {i[1].map((j: any, jidx: number) => (
                    <TreeItem
                      onClick={() => setTitle(j.value)}
                      nodeId={`${j.key}_${jidx}`}
                      label={j.value}
                    />
                  ))}
                </TreeItem>
              ))}
            </TreeView>
          </Row>
        </Col>
        <Col
          style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "10px" }}
        >
          <Row
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Col>
              <Row
                style={{
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem",
                  letterSpacing: "10px",
                  fontWeight: 400,
                }}
              >
                {`[ ${title} ]`}
              </Row>
              <Row style={{ height: "calc(100% - 100px)" }}>
                <GridBase
                  columnDefs={[
                    {
                      headerName: "종합효율",
                      children: [
                        { field: "date", headerName: "날짜", flex: 1 },
                        {
                          field: "time_rate",
                          headerName: "시간가동률",
                          flex: 1,
                        },
                        {
                          field: "perfor_rate",
                          headerName: "성능가동률",
                          flex: 1,
                        },
                        { field: "oee", headerName: "OEE", flex: 1 },
                      ],
                    },
                  ]}
                />
              </Row>
            </Col>
          </Row>

          <Row style={{ height: "100%" }}>
            <GridBase
              columnDefs={[
                {
                  headerName: "실적",
                  children: [
                    { field: "date", headerName: "날짜", flex: 1 },
                    {
                      field: "model",
                      headerName: "모델",
                      flex: 1,
                    },
                    {
                      field: "pnl",
                      headerName: "실적(PNL)",
                      flex: 1,
                    },
                    {
                      field: "m2",
                      headerName: "실적(m2)",
                      flex: 1,
                    },
                  ],
                },
              ]}
            />
          </Row>
        </Col>
      </Row>
    </ListBase>
  );
};

export default EfficiencyReport;
