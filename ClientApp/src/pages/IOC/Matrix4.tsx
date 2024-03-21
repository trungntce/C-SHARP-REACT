import React from "react";
import { Row, Col } from "reactstrap";

import myStyle from "./Matrix4.module.scss";
import Matrix4Unit from "./Matrix4Unit";

const Matrix4 = () => {
  return (
    <>
      <div className={`${myStyle.matrix4Container} min-vh-100 p-3`}>
        <Row style={{ height: "50%" }} className="mb-1">
          <Col
            style={{
              height: "100%",
              backgroundColor: "#9babb84d",
              padding: "5px",
              borderRadius: "5px",
              width: "50%",
              marginRight: "2.5px",
            }}
          >
            <Matrix4Unit
              title="LASER"
              oeeVal={90}
              stVal={85}
              stPer={`${14}s`}
              prodCnt={`${(1004).toLocaleString()}EA`}
              targetCnt={`${(1200).toLocaleString()}EA`}
              planCnt={`${(1200).toLocaleString()}EA`}
              runtime={`15h 38m`}
            />
          </Col>
          <Col
            style={{
              height: "100%",
              backgroundColor: "#9babb84d",
              padding: "5px",
              borderRadius: "5px",
              width: "50%",
              marginLeft: "2.5px",
            }}
          >
            <Matrix4Unit
              title="PREPROCESSING"
              oeeVal={75}
              stVal={88}
              stPer={`${32}s`}
              prodCnt={`${(332).toLocaleString()}EA`}
              targetCnt={`${(400).toLocaleString()}EA`}
              planCnt={`${(450).toLocaleString()}EA`}
              runtime={`12h 05m`}
            />
          </Col>
        </Row>
        <Row
          style={{
            height: "50%",
          }}
        >
          <Col
            style={{
              height: "100%",
              backgroundColor: "#9babb84d",
              padding: "5px",
              borderRadius: "5px",
              width: "50%",
              marginRight: "2.5px",
            }}
          >
            <Matrix4Unit
              title="CMI"
              oeeVal={67}
              stVal={97}
              stPer={`${200}s`}
              prodCnt={`${(3228).toLocaleString()}EA`}
              targetCnt={`${(4500).toLocaleString()}EA`}
              planCnt={`${(4700).toLocaleString()}EA`}
              runtime={`11h 35m`}
            />
          </Col>
          <Col
            style={{
              height: "100%",
              backgroundColor: "#9babb84d",
              padding: "5px",
              borderRadius: "5px",
              width: "50%",
              marginLeft: "2.5px",
            }}
          >
            <Matrix4Unit
              title="BBT"
              oeeVal={88}
              stVal={68}
              stPer={`${67}s`}
              prodCnt={`${(137).toLocaleString()}EA`}
              targetCnt={`${(150).toLocaleString()}EA`}
              planCnt={`${(170).toLocaleString()}EA`}
              runtime={`10h 32m`}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Matrix4;
