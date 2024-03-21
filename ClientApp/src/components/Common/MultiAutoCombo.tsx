import { forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Dictionary } from "../../common/types";
import { getMap } from "../../common/utility";
import Autocomplete from '@mui/material/Autocomplete'
import { Checkbox, FilterOptionsState, Popper, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { alertBox } from "../MessageBox/Alert";

const MultiAutoCombo = forwardRef((props: any, ref: any) => {
  const maxCount = 100;

  const autoRef = useRef<any>();
  const valueRef = useRef<any>();
  const fontRef = useRef<string>("");

  const maxValueWidth = useRef<number>(0);
  const maxLabelWidth = useRef<number>(0);

  const widthGap = 40;

  const [mapCode, setMapCode] = useState<any>(props.mapCode);
  const [category, setCategory] = useState<any>(props.category);
  const [values, setValues] = useState<Dictionary[]>([]);
  const [maps, setMaps] = useState<Dictionary[]>([]);
  const [maxDisabled, setMaxDisabled] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({ 
    setValue: (values: Dictionary[]) => {
      valueRef.current.value = JSON.stringify(values);
      setValues(values);
    },
    getValues: () => values,
    setMaps,
    setMapCode,
    setCategory
  }));

  useEffect(() => {
    getMap(mapCode, category).then((result: any) => {
      if(result.data && result.data.length){
        setMaps([...result.data])
        
        if(valueRef.current?.value?.length){
          const vals = JSON.parse(valueRef.current.value);
          //setValues(selected.length ? [selected[0]] : []);

          autoRef.current.querySelector(".MuiAutocomplete-clearIndicator")?.click();
        }
      }else{
        setMaps([]);
        autoRef.current.querySelector(".MuiAutocomplete-clearIndicator")?.click();
      }
    })
  }, [mapCode, category]);

  const changeHandler = (event: SyntheticEvent<Element, Event>, newValues: Dictionary[]) => { 
    if(props.maxSelection){
      if(newValues.length > props.maxSelection){
        alertBox(`최대 ${props.maxSelection}개까지 선택 가능합니다.`);
        return;
      }
    }

    valueRef.current.value = JSON.stringify(newValues);

    props.onChange && props.onChange(event, values);
  }

  const filterOptions = (options: Dictionary[], state: FilterOptionsState<Dictionary>) => {
    const rtn: Dictionary[] = [];

    const font = getFont();

    for(let i = 0; i < maps.length; i++){
      const item = maps[i];

      if (!item.label){
        item.label = "";
      }

      if(item.label?.toLowerCase()?.indexOf(state.inputValue.toLowerCase()) >= 0 ||
        item.value?.toLowerCase()?.indexOf(state.inputValue.toLowerCase()) >= 0){
        rtn.push(item);

        const valueWidth = calcTextWidth(item.value, font);
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
      const fontFamily = getCss(el[0], "font-family");
  
      fontRef.current = `${fontWeight} 0.85rem ${fontFamily}`;
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
    return <div className="multiautocombo-popper-container"><Popper {...props} style={{ width: "fit-content" }} placement="bottom-start" /></div>;
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <div className={props.display == "inline" ? "multiauto-inline-fix" : ""}>
      <input ref={valueRef} name={props.name} type="hidden" />
      <Autocomplete        
        ref={autoRef}
        multiple={true}
        className="multiautocombo-container"
        disabled={props.disabled || maxDisabled}
        PopperComponent={PopperWider}
        defaultValue={values}
        disablePortal
        options={maps}
        filterOptions={filterOptions}
        onChange={changeHandler}
        sx={props.sx}
        size="small"
        filterSelectedOptions
        disableCloseOnSelect
        limitTags={props.limitTags ?? -1}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={props.placeholder}
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={`key_${option.value}`}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            <span style={{ width: maxValueWidth.current + widthGap }} className="dropdown-value">&nbsp;{option.value}</span>
            <span style={{ width: maxLabelWidth.current + widthGap }} className="dropdown-label">{option.label}</span>
          </li>
        )}
      />
    </div>
  );
});

export default MultiAutoCombo;
