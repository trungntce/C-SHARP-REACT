import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Card, CardHeader, CardBody, InputGroup, InputGroupText, Table } from "reactstrap";
import { Dictionary } from "../../../common/types";
import { executeIdle } from "../../../common/utility";
import { alertBox } from "../../../components/MessageBox/Alert";
import { ReverseMaxtrix } from "./EMappingLayoutList";
import { useTranslation } from "react-i18next";

const EMappingLayoutEdit = forwardRef((props: any, ref: any) => {  
  const { t } = useTranslation();
  const [pcsDic, setPcsDic] = useState<ReverseMaxtrix>({});
  const [hv, setHV] = useState<number[]>([0, 0]);

  const addMatrix = (x: number, y: number) => {
    const pcsIndex = findPcs(y, x);

    if(pcsIndex ?? -1 >= 0){
      delete pcsDic[pcsIndex!];

      setPcsDic(refinePcsList());
    }else{
      const dic = {...pcsDic};

      const max = getMaxSeq();
      dic[((max == -Infinity) ? 0 : max || 0) + 1] = { x, y };

      setPcsDic(dic);
    }
  }

  const refinePcsList = () => {
    const dic: ReverseMaxtrix = {};

    const keys = getkeyList();
    const sorted = keys.sort((a, b) => a - b);

    for(let i = 0; i < sorted.length; i++){
      dic[i + 1] = pcsDic[keys[i]];
    }

    return dic;
  }

  const findPcs = (y: number, x:number) => {
    const list = getkeyList();

    for(let i in list){
      const pcsIndex = list[i];
      const xy = pcsDic[pcsIndex];
      if(xy["x"] == x && xy["y"] == y){
        return pcsIndex;
      }
    }
  }

  const getkeyList = () => {
    return Object.keys(pcsDic).map(x => parseInt(x, 10));
  }

  const getMaxSeq = () => {
    return Math.max.apply(Math, getkeyList());
  }
  
  useImperativeHandle(ref, () => ({ 
    setPcsListEx: (row: Dictionary) => {      
      setPcsDic(JSON.parse(row.pcsJson));
    },
    setHVEx: (row: Dictionary) => {
      const h = parseInt(row.pcsPerH);
      const v = parseInt(row.pcsPerV);

      const list = getkeyList();

      for (let i = list.length - 1; i >= 0; i--) {
        const pcsIndex = list[i];
        const pcs = pcsDic[pcsIndex];

        if (pcs.x! >= h || pcs.y! >= v)
          delete pcsDic[pcsIndex];
      }

      setPcsDic(refinePcsList());
      setHV([h, v]);
    },
    getPcsList: () => pcsDic,
  }));

  useEffect(() => {
  }, []);

  // if(!model)
  //   return null;

  return (
    <Table className="table table-bordered table-emaplayout" style={{ height: "100%" }}>
      <tbody>
        {[...Array(hv[1]).keys()].map((y: number) => (
          (
            <tr key={y} style={{ height: `${100 / hv[1]}%` }}>
              {[...Array(hv[0]).keys()].map((x: number) => (
                (
                  <td key={x} style={{ width: `${100 / hv[0]}%` }}
                    className={findPcs(y, x) ? "setted" : ""}
                    onClick={() => {
                      addMatrix(x, y);
                    }}>
                      <>{ findPcs(y, x) }</>
                  </td>
                )
              ))}
            </tr>
          )
        ))}
      </tbody>
    </Table>
  );
});

export default EMappingLayoutEdit;
