import { forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Dictionary } from "../../common/types";
import { getLang, getMap } from "../../common/utility";
import Autocomplete from '@mui/material/Autocomplete'
import { FilterOptionsState, Popper } from "@mui/material";

const AutoCombo = forwardRef((props: any, ref: any) => {
  const maxCount = 100;

  const autoRef = useRef<any>();
  const valueRef = useRef<any>();
  const parentRef = useRef<any>();
  const fontRef = useRef<string>("");

  const maxValueWidth = useRef<number>(0);
  const maxLabelWidth = useRef<number>(0);

  const hideValue: boolean = !!props.hideValue;

  const widthGap = 35;

  const [mapCode, setMapCode] = useState<any>(props.mapCode);
  const [category, setCategory] = useState<any>(props.category);
  const [value, setValue] = useState<any>({ value: "", label: "" });
  const [maps, setMaps] = useState<Dictionary[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({ 
    setValue: (val: Dictionary | null) => {
      valueRef.current.value = val?.value;
      parentRef.current.value = val?.parent;
      setValue(val);
    },
    setEmpty: () => {
      valueRef.current.value = '';
      parentRef.current.value = '';
    },    
    setSelect: (val: string) => {
      if(val){
        valueRef.current.value = val;
      }
    },
    getValue: () => value,
    setMaps,
    setMapCode,
    setCategory,
    setOpen: (open: boolean) => {
      setOpen(open);
    }
  }));

  useEffect(() => {
    if(!mapCode)
      return;
    getMap(mapCode, category).then((result: any) => {
      const first = { value: "", label: "" };
      if(result.data && result.data.length){
        if(props.isLang){
          result.data.forEach((map: Dictionary) => {
            map.label = getLang(map.label);
          });
        }

        setMaps([...[first], ...result.data])
        
        if(valueRef.current){
          const selected = result.data.filter((x: any) => x.value == valueRef.current.value);
          setValue(selected.length ? selected[0] : first);
        }
      }else{
        setMaps([first]);
        setValue(first);
      }
    })
  }, [mapCode, category]);

  const changeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => { 
    valueRef.current.value = value?.value;
    parentRef.current.value = value?.parent;
    setValue(value);

    props.onChange && props.onChange(event, value);
  }

  const filterOptions = (options: Dictionary[], state: FilterOptionsState<Dictionary>) => {
    const rtn: Dictionary[] = [];

    const font = getFont();

    for(let i = 0; i < maps.length; i++){
      const item = maps[i];

      if (!item.label){
        item.label = "";
      }

      if(
        (!hideValue && (item.value && item.value.toLowerCase().indexOf(state.inputValue.toLowerCase()) >= 0)) || 
        (item.label && item.label.toLowerCase().indexOf(state.inputValue.toLowerCase()) >= 0)){
        rtn.push(item);

        const valueWidth = !hideValue ? calcTextWidth(item.value, font) : 0;
        const labelWidth = calcTextWidth(item.label, font);

        maxValueWidth.current = valueWidth > maxValueWidth.current ? valueWidth : maxValueWidth.current;
        maxLabelWidth.current = labelWidth > maxLabelWidth.current ? labelWidth : maxLabelWidth.current;

        if(rtn.length >= maxCount)
          break;
      }
    }

    return rtn;
  };

  const getFont = () => {
    if(!fontRef.current){
      const el = document.getElementsByClassName("autocomplete-input");

      const fontWeight = getCss(el[0], "font-weight");
      //const fontSize = getCss(el[0], "font-size");
      const fontFamily = getCss(el[0], "font-family");
  
      fontRef.current = `${fontWeight} .9rem ${fontFamily}`;
    }

    return fontRef.current;
  }

  const calcTextWidth = (text: string, font: any) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if(!context)
      return 0;

    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  const getCss = ( element: Element, property: string ) => {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }

  const PopperWider = (props: any) => {
    return <Popper {...props} style={{ width: "fit-content" }} placement="bottom-start" />;
  };

  return (
    <>
      <input ref={valueRef} name={props.name} type="hidden" />
      <input ref={parentRef} name={props.parentname} type="hidden" />
      <Autocomplete
        ref={autoRef}
        style={props.disabled ? { backgroundColor: "#cccccc50" } : undefined}
        disabled={props.disabled}
        PopperComponent={PopperWider}
        isOptionEqualToValue={props.onlyCompareValue ? (option, value) => option.value === value.value : undefined}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        disablePortal={props.disablePortal ?? true }
        options={maps}
        filterOptions={filterOptions}
        onChange={changeHandler}
        sx={props.sx}
        ListboxProps={props.ListboxProps}
        renderInput={(params) => {
          params.inputProps.className = `${params.inputProps.className} form-control autocomplete-input`;
          return(
            <>
              <div ref={params.InputProps.ref} className={`input-group ${props.required ? "required" : ""}`}>
                <input type="text" name={props.labelname} 
                  placeholder={props.placeholder}
                  required={props.required}
                  {...params.inputProps} />
                  {props.disabled ? "" : (<span className="input-group-append"><i className="uil uil-search me-2"></i></span>)}
              </div>
            </>
        )}}
        renderOption={(props, option, { selected }) => {
          return (
          <li {...props} key={`key_${props.id}`}>
            { !hideValue && (
              <span style={{ width: maxValueWidth.current + widthGap }} className="dropdown-value">&nbsp;{option.value}</span>
            ) }            
            <span style={{ width: maxLabelWidth.current + widthGap }} className="dropdown-label">{option.label}</span>
          </li>
        )}}
      />
    </>
  );
});

export default AutoCombo;
