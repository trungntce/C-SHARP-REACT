import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import { getMap } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";

const LanguageEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const initRow = useRef<Dictionary>();
  const [langMaps, setLangMaps] = useState<Dictionary[]>([]);

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.langCode) {
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    const data = Array.from(formData);

    let result = data.reduce((obj: Dictionary, item: [string, FormDataEntryValue]) => {
      const key = `${item[0]}`;
      const val = item[1];

      if (!obj[key]) 
        obj[key] = item[1];
      else {
        if (Array.isArray(obj[key]))
          obj[key].push(val);
        else{
          obj[key] = [obj[key], val];
        }
      }

      return obj;
    }, {});

    for(const key in result){
      if(Array.isArray(result[key])){
        const listKey = `${key}List`;
        result[listKey] = result[key];
        result[key] = result[listKey][0];
      }
    }

    props.onComplete(result, initRow.current);
  };

  useEffect(() => {
    getMap("code", "LANG_CODE").then((result: any) => {
      setLangMaps(result.data);
    });
  }, []);

  return (
    <EditBase
      ref={ref}
      header="Laguage Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="langCode">
              다국어코드
            </Label>
            <Input name="langCode" type="text" className="form-control" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      {
        langMaps.map((item: Dictionary, index: number) =>
          (
            <Row key={index}>
              <Col md={4}>
                <div className="mb-3">
                  <Input value={t(item.label)} type="text" className="form-control" required={true} disabled={true} />
                  <Input name={`nationCode`} value={item.value} type="hidden" className="form-control" />
                </div>
              </Col>
              <Col md={8}>
                <div className="mb-3">
                  <Input name={`langText`} type="text" className="form-control" required={true} />
                </div>
              </Col>
            </Row>
          )
        )
      }
      
    </EditBase>
  );
});

export default LanguageEdit;
