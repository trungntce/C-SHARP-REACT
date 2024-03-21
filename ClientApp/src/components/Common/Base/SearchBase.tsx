import { forwardRef, useImperativeHandle, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Form,
} from "reactstrap";
import { useSubmitHandler, useSubmitRef } from "../../../common/hooks";

const SearchBase = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const [formRef, setForm] = useSubmitRef();
  const submitHandler = useSubmitHandler(props.searchHandler);

  useImperativeHandle(ref, () => ({ 
    setForm,
    getSearchRef: () => formRef
  }));

  return (
    <Form 
      className="search-wrap"
      innerRef={formRef}
      onSubmit={submitHandler}>
      <Row>
        <Col className="d-inline-flex gap-2">
          { props.children }
        </Col>
        <Col size="auto" className="search-button-row text-end" style={{ ...{ maxWidth: "200px" }, ...props.style}}>
          { props.buttons || 
            <>
              {props.preButtons }
              <Button type="submit" color="primary">
                <i className="uil uil-search me-2"></i> {t("@SEARCH")}
              </Button>
              {props.postButtons }
            </>
          }
        </Col>
      </Row>
    </Form>
  );
});

export default SearchBase;
