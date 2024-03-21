import React, { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { executeIdle, isNullOrWhitespace } from "../../common/utility";
import style from "./LangTextBox.module.scss";

export const langList: readonly string[] = ["ko-KR", "vi-VN", "en-US"];
export const emojiList: readonly string[] = ["🇰🇷", "🇻🇳", "🇺🇸"];

const KEY_TAB = 'Tab';

const LangTextBox = forwardRef((props: any, ref: any) => {

  const itemContainerRef = useRef<any>();

  const valueRef = useRef<any>();
  const valuesRef = useRef<any[]>([]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, langCode: string) => {
    const index = langList.indexOf(langCode);
    if(index < 0)
      return;

    valueRef.current.value = valuesRef.current.map(x => x.value).join('::');
  }

  const focusHandler = (e: React.FocusEvent<HTMLElement>) => {
    if(props.mode != "single")
      return;

    itemContainerRef.current.classList.add("show-item");
  }

  const blurHandler = (e: React.FocusEvent<HTMLElement>) => {
    if(props.mode != "single")
      return;

    itemContainerRef.current.classList.remove("show-item");
  }

  const setValues = (val: string | null) => {
    for(let i in valuesRef.current){
      valuesRef.current[i].value = '';
    }

    if(isNullOrWhitespace(val)){
      return;
    }

    const spts = val!.split('::');
    spts.forEach((x: string, i: number) => {
      if(spts.length >= i + 1)
        valuesRef.current[i].value = spts[i];
    });

  }

  useImperativeHandle(ref, () => ({ 
    setValue: (value: string | null) => {
      valueRef.current.value = value || '';
      setValues(value);
    },
    getValue: () => valueRef.current.value,    
    setFocus: (index: number) => {
      valuesRef.current[index].focus();
    }
  }));

  useEffect(() => {
    executeIdle(() => {
      const val = valueRef.current.value;

      setValues(val);
    });
  }, []);

  const renderChild = (x: string, i: number) => {
    return (
      <React.Fragment key={i}>
        <InputGroupText>
          {x}
        </InputGroupText>
        <Input name={`${props.name}[${x}]`} autoComplete="off" 
          required={props.required}
          innerRef={(ref) => (valuesRef.current[i] = ref)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {changeHandler(e, x);}}
          onKeyDown={(event: any) => {
            if(!props.inline)
              return;

            if (event.key === KEY_TAB) {
              for (let i = 0; i < valuesRef.current.length; i++) {
                if(valuesRef.current[i] == event.target){
                  if(i < valuesRef.current.length - 1){
                    valuesRef.current[i + 1].focus();
                    break;
                  }
                }
              }

              valueRef.current.value = valuesRef.current.map(x => x.value).join('::');
            }
          }} />
        <div className="break"></div>
      </React.Fragment>
    );
  }

  return (
    <div className={`${style.langTextBoxContainer} ${props.mode == "sm" ? style.langTextBoxContainerSm : ""}`}>
      <input ref={valueRef} name={props.name} value={props.defaultValue} type="hidden" />
      { props.mode == "single" ? (
        <div ref={itemContainerRef} className="lang-item-container" onFocus={focusHandler} onBlur={blurHandler}>
          <div>
            { langList.map((x: string, i: number) => (
              <InputGroup key={i} size="md" className="mode-single">
                { renderChild(x, i) }
              </InputGroup>
            ))}
          </div>
        </div>
      ) : (
        <InputGroup size="md" className="mode-multiple">
          { langList.map(renderChild) }
        </InputGroup>
      ) }
    </div>
  );
});

export default LangTextBox;
