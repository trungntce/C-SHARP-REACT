import Icon, { IconName } from "@ailibs/feather-react-ts";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { executeIdle } from "../../common/utility";
import DynamicIcon from "./DynamicIcon";
import IconPicker from "./IconPicker";

const IconInput = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const formRef = useRef<any>(props.formRef);
  const iconRef = useRef<any>();
  const inputRef = useRef<any>();
  const iconPickerRef = useRef<any>();

  const iconSearchHandler = () => {
    iconPickerRef.current.setIsOpen(true);
  }

  const iconSelectHandler = (icon: IconName) => {
    iconRef.current.setIconText(icon);
    formRef.current.current.elements[props.name].value = icon;
  }
  
  useImperativeHandle(ref, () => ({ 
    setIconText: (icon: IconName | "" | null | undefined) => {
      if(icon)
        iconRef.current.setIconText(icon);
    }
  }));

  return (
    <>
      <InputGroup>
        <InputGroupText style={{ display: "inline-block", minWidth: "45px", paddingRight: "10px", textAlign: "center" }}>
          <DynamicIcon ref={iconRef} size={props.size} />
        </InputGroupText>
        <Input name={props.name} ref={inputRef} type="text" autoComplete="off" />
        <Button type="button" color="light" onClick={iconSearchHandler}>
          <i className="uil uil-search me-2"></i> {t("@SEARCH")}</Button>
      </InputGroup>
      <IconPicker ref={iconPickerRef} onIconSelect={iconSelectHandler} />
    </>
  );
});

export default IconInput;