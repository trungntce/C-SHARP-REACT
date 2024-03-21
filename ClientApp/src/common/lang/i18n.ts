import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { globalContext } from '../../components/VerticalLayout/Menu';
import api from '../api';
import { Dictionary } from '../types';
import { getMap } from '../utility';

const result = await Promise.all([
  getMap<Dictionary[]>("code", "LANG_CODE"),
  api<Dictionary[]>("get", "language/listbynation", {})
]);

globalContext.languages = {};
var resources: Dictionary = {};

result[0].data.forEach((x : any, index : any) => {
  
  const value = x.value;
  const label = x.label;

  globalContext.languages[value] = label;

  const data = (result[1].data as Dictionary)[`item${index + 1}`];
  const resource: Dictionary = {};
  data.forEach((y: any) => {
    resource[y.langCode] = y.langText;
  });

  resources[value] = { translations: resource };
});

const userLang = localStorage.getItem("user-lang") || "ko-KR";
globalContext.userLang = userLang;

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    // 초기 설정 언어
    lng: userLang,
    fallbackLng: userLang,
    debug: true,
    defaultNS: 'translations',
    ns: 'translations',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  })

  export default i18n;