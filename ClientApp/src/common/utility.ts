import { AxiosResponse } from "axios";
import moment from "moment";
import api from "./api";
import { Dictionary } from "./types";
import {toHtml} from 'hast-util-to-html'
import {parse} from '@tracespace/parser'
import {plot} from '@tracespace/plotter'
import {render} from '@tracespace/renderer'
import { useTranslation } from "react-i18next";
import { emojiList, langList } from "../components/Common/LangTextBox";
import { globalContext } from "../components/VerticalLayout/Menu";

export const getLangAll = (val: string) => {
  return getLang(val, langList);
}

export const getLang = (val: string, lanCodes?: string | readonly string[] | undefined) => {

  if(isNullOrWhitespace(val))
    return val;

  if(val.indexOf('::') < 0)
    return val;

  let lanList: string[] = [];
  
  if(!lanCodes)
    lanList.push(globalContext.userLang);
  
  if(typeof lanCodes == "string")
    lanList.push(lanCodes);

  if(typeof lanCodes == "object")
    lanList = lanList.concat(lanCodes);

  if(lanList.length == 1){
    const index = langList.indexOf(lanList[0]);
    if(index < 0)
      return val;
      
    return safeSplit(val, '::', index);
  }

  const rtnList = lanList.map(x => {
    const index = langList.indexOf(x);
    if(index < 0)
      return;

    return `${emojiList[index]} ${safeSplit(val, '::', index)}`;;
  });

  return rtnList.join(', ');
}

export const safeSplit = (val: string, splitter: string, index: number) => {
  if(isNullOrWhitespace(val))
    return val;

  if(isNullOrWhitespace(splitter))
    return val;

  if(val.indexOf(splitter) < 0)
    return val;

  const spts = val.split(splitter);
  if(index >= spts.length)
    return val;

  return spts[index];
}

export const safeString = (val: any): string => {
  if (val === 0) return val;

  if (!val) return "";

  return val;
};

export const safeNumber = (val: any) => {
  if (!val) return 0;

  return val;
};

export const isNumber = (n: any) => { 
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

export const numberWithCommas = (val:number) => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const isNullOrWhitespace = (txt: string | null | undefined) => {
  if (typeof txt === "undefined" || txt == null || txt == undefined || txt == "undefined") 
    return true;

  return txt.replace(/\s/g, "").length < 1;
};

export const safeToString = (value: any): string => {
  if (typeof value === "string") 
    return value as string;

  if (typeof value === "undefined" || value == "undefined" || value == null || value == undefined) 
    return ""

  if(value === 0)
    return "0"
  
  if(value.toString)
    return value.toString();

  return "";
};

export const getMap = <T>(mapCode: string, category?: string): Promise<AxiosResponse<T, any>> => {
  return api("get", "/map", { mapCode, category });
};

export const validateForm = (mustField: string[], values: Dictionary): boolean => {
  return !mustField.find((x) => isNullOrWhitespace(values[x]));
};

export const dateFormat = (date: any, format: string = "YYYY-MM-DD HH:mm") => {
  if(!date)
    return "";

  return moment(date).format(format);
}

export const dayFormat = (date: any, format: string = "YYYY-MM-DD") => {
  if(!date)
    return "";

  return moment(date).format(format);
}

export const fromNow = (date: any) => {
  if(!date)
    return "";

  return moment(date).fromNow();
}

export const padLeft = (s: string, length: number) => {
  return s?.padStart(length, '0');
}

export const padLeftNum = (n: number, length: number) => {
  return padLeft(n?.toString(), length);
}

export const toHHMM = (min: number) => {
  const minutes = Math.floor(min % 60);
  const hours = Math.floor(min / 60);

  return `${padLeftNum(hours, 2)}:${padLeftNum(minutes, 2)}`;
}

export const currencyFormat = (currency: number, sign: string = '') => {
  if(!currency && currency !== 0)
    return "";

  const sansDec = currency.toFixed(0);
  const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${formatted}`;
}

export const floatFormat = (num: number, fixed: number = 2) => {
  if(!num && num !== 0)
    return "";

  num = parseFloat(num as any);
  if(!num && num !== 0)
    return "";

  const formatted = num.toFixed(fixed);
  return `${formatted}`;
}

export const percentFormat = (num: number, fixed: number = 2) => {
  if(!num && num !== 0)
    return "";

  num = parseFloat(num as any);
  if(!num && num !== 0)
    return "";    

  const formatted = num.toFixed(fixed);
  return `${formatted}%`;
}

export const devideFormat = (num: number, denom: number, fixed: number = 2, postfix: string = '%') => {
  if(!num && num !== 0)
    return "";

  if(!denom && denom !== 0)
    return "";

  const formatted = (num / denom * 100).toFixed(fixed);
  return `${formatted}${postfix}`;
}

export const nullGuard = (val: any, defaultValue: any = "") => {
  if(val === null || val === undefined)
    return defaultValue;

  return val;
}

export const executeIdle = (fn: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any)["requestIdleCallback"](() => {
      fn();
    });
  } else {
    setTimeout(() => {
      fn();
    }, 10);
  }
}

export const showLoading = (gridRef: any, isShow: boolean) => {
  if(gridRef.current && gridRef.current.api?.showLoadingOverlay){
    if(isShow)
      gridRef.current.api.showLoadingOverlay();
    else
      gridRef.current.api.hideOverlay();
  }
}

export const toQueryString = (param: Dictionary) => {
  return Object.keys(param).map((key) => {
    if(isNullOrWhitespace(safeToString(param[key])))
      return "";
    return encodeURIComponent(key) + '=' + encodeURIComponent(param[key])
  }).join('&');
}

export const easeOutCirc = (x: number): number => {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export const easeOutQuad = (x: number): number => {
	return 1 - (1 - x) * (1 - x) * (1 - x) * (1 - x) * (1 - x);
}

export const downloadFile = (fileName: string, blobType: string, blobParts?: BlobPart[]) => {
  const blob = new Blob(blobParts, { type: blobType });
  const href = window.URL.createObjectURL(blob);  

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style["display"] = "none;"
  a.href = href;
  a.download = fileName;
  a.click();

  window.URL.revokeObjectURL(href);
}

export const yyyymmddhhmmss = () => {
  return (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

export const gbrToSvg = (gbr: string) => {
  const syntaxTree = parse(gbr)
    const imageTree = plot(syntaxTree)
    const image = render(imageTree)
    return toHtml(image);
}

export const snakeCaseToCamelCase = (input: string) =>
  input
    .split("_")
    .reduce(
      (res, word, i) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
              .substring(1)
              .toLowerCase()}`,
      ""
    );

export const jsonToCamelCase = (json: Dictionary) => {
  const result: Dictionary = {};
  Object.keys(json).forEach((key) => {
    result[snakeCaseToCamelCase(key)] = json[key];
  });
  return result;
}

export const listToCamelCase = (list: Dictionary[]) => {
  return list.map((x) => jsonToCamelCase(x));
}

export const merge = (a: any[], b: any[], i = 0) => {
  return a.slice(0, i).concat(b, a.slice(i));
}