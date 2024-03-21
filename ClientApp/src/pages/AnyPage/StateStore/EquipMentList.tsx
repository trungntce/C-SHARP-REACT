import { atom, selectorFamily } from "recoil";

export const EquipMentList = atom<any[]>({
  key: "EquipMentList",
  default: [],
});

export const EquipStatus = atom<any[]>({
  key: "total",
  default: [],
});

export const EquipForM = atom<any[]>({
  key: "EquipForM",
  default: [],
});

export const CalcByEqpType = atom<any[]>({
  key:"CalcByEqpType",
  default:[],
});

export const TimeStatus = atom<any[]>({
  key:"TimeStatus",
  default:[],
})