import React, { ChangeEvent, forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Row, Col, } from "reactstrap";
import { Dictionary } from "../../../common/types";
import { useTranslation } from "react-i18next";
import { executeIdle } from "../../../common/utility";
import ParamChartItemRange from "./ChartItemRange";
import ParamChartItemLine from "./ChartItemLine";

const ParamChartBody = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<Dictionary[]>([]);

  const chartRef = useRef<Dictionary>({});

  const refsById = useMemo(() => {
    const refs: Dictionary = {};
    items.forEach((item) => {
      refs[item.index] = React.createRef();
    });
    return refs;
  }, [items]);

  const deleteItemHandler = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);

    setItems(newItems);
  };

  useImperativeHandle(ref, () => ({
    setItems,
    getItems: () => items,
  }));

  useEffect(() => {
    executeIdle(() => {
      Object.entries(chartRef.current).map((x) => {
        const key = x[0];
        const ref = x[1];

        if (ref) ref.drawChart();
      });
    });
  }, [items]);

  return (
    <>
      <Row style={{ height: "calc(100% - 75px)" }} className="mb-2">
        <Col md={12} style={{ height: "100%" }}>
          {items.map((x, i) => (
            <React.Fragment key={i}>
              { x.chartType == 'L' ? (
                <ParamChartItemLine
                  config={x}
                  index={i}
                  length={items.length}
                  onDeleteItem={deleteItemHandler}
                  ref={(ref) => (chartRef.current[i] = ref)}
                ></ParamChartItemLine>
              ) : (
                <ParamChartItemRange
                  config={x}
                  index={i}
                  length={items.length}
                  onDeleteItem={deleteItemHandler}
                  ref={(ref) => (chartRef.current[i] = ref)}
                ></ParamChartItemRange>
              ) }
            </React.Fragment>
          ))}
        </Col>
      </Row>
    </>
  );
});

export default ParamChartBody;
