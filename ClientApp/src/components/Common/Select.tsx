import { ChangeEvent, ChangeEventHandler, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { executeIdle, getMap } from "../../common/utility";
import * as ReactDOMClient from 'react-dom/client';
import { Dictionary } from "../../common/types";

const Select = forwardRef((props: any, ref: any) => {
  const valueRef = useRef<any>();
  const selectRef = useRef<any>();

  useEffect(() => {
    getMap(props.mapCode, props.category).then((result: any) => {
      const first = { value: "", label: props.label };
      let maps = [first];
      if(result.data && result.data.length){
        maps = [...maps, ...result.data];
      }

      const options = maps.map((item, index) => {
        return (<option key={index} value={item.value}>{item.label}</option>)
      });

      const root = ReactDOMClient.createRoot(selectRef.current);
      root.render(options);

      executeIdle(() => {
        if(valueRef.current && valueRef.current.value){
          selectRef.current.value = valueRef.current.value;
        }
        else if(props.defaultValue){
          selectRef.current.value = props.defaultValue;
        }
      });
    })
  }, [props]);

  useImperativeHandle(ref, () => ({ 
    setValue: (value: Dictionary | null) => {
      valueRef.current.value = value?.value;
      selectRef.current.value = valueRef.current.value;
    },
    getValue: () => valueRef.current,
  }));

  return (
    <>
      <input ref={valueRef} name={props.name} value={props.defaultValue} type="hidden" />
      <select ref={selectRef}
        id={`select-${props.name}`}
        className={props.className}
        required={props.required}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => { 
          valueRef.current.value = selectRef.current.value; 
          props.onChange && props.onChange(event, valueRef.current.value);
        }}
        />
    </>
  );
});

export default Select;