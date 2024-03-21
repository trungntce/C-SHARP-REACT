
import myStyle from "./EquipMain.module.scss";
import { TimeFormat } from "../../utills/getTimes";
import { dayFormat } from "../../../../common/utility";
import ProductionStatus from "./ProductionStatus";

const EquipMain = ({ selectedData }: any) => {

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#42464e",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "85px",
            backgroundColor: "#42464e",
            paddingLeft: "10px",
            paddingRight: "10px",
            justifyContent: "space-between",
          }}
        >
          <div className={myStyle.operation}>
            
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: "2.1rem",
                color: "#f5d900",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {selectedData?.eqp_desc}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: "1.3rem",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {`[ ${selectedData?.eqp_code} ]`}
            </div>
          </div>
          <div
            style={{
              flex: 0.5,
              fontSize: "18px",
              color: "#dcdcdc66",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              className={myStyle.date}
              style={{
                flex: 1,
                fontSize: "2.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                letterSpacing: 2,
                color: "white",
              }}
            >
              <span>{dayFormat(selectedData?.real?.mesDt)}</span>
            </div>
            <div
              className={myStyle.date}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div>{`Search_Date : ${
                selectedData?.mes_date
                  ? TimeFormat(selectedData?.mes_date)
                  : ""
              }`}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 10, display: "flex", flexDirection: "column" }}>
        <ProductionStatus data={selectedData} />
      </div>
    </div>
  );
};

export default EquipMain;
