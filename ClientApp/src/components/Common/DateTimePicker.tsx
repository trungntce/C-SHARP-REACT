import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { executeIdle } from "../../common/utility";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {ko, vi, enUS} from 'date-fns/esm/locale'

const DateTimePicker = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const { required, name, dateFormat, ...rest } = props;

  const [date, setDate] = useState<Date>(props.defaultValue || new Date());
  
  useImperativeHandle(ref, () => ({ 
    setDate,
  }));

  return (
    <>
      <InputGroup className={`datetimepicker-container ${required && "required-container"}`}>
        <DatePicker 
          required={required}
          name={name}
          locale={ko}
          selected={date}
          onChange={(d: Date) => setDate(d)}
          dateFormat={ dateFormat || "yyyy-MM-dd" } 
          className="form-control" 
          placeholderText=""
          {...rest}
        />
        <span className="input-group-append"><i className="uil uil-calendar-alt me-2"></i></span>
      </InputGroup>
    </>
  );
});

export default DateTimePicker;