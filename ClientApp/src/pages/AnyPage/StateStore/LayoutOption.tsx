import { atom } from "recoil";

export const LayoutOptionState = atom({
  key: "LayoutOption",
  default: {
    capacityYn: "",
    cntYn: "",
    errcntYn: "",
    errrateYn: "",
    oeeYn: "",
    roomName: "",
    stdYn: "",
    worktimeYn: "",
    transitionYn:"",
    paramYn:""
  },
});
