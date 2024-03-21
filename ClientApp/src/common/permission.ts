import { PermMethod } from "./types";

export const parseUsergroup = () => {
  try{
    return JSON.parse(localStorage.getItem("auth-usergroup") as string);
  }catch(ex){
    return [];
  }
}

export const checkUsergroup = (groupToCheck: string, groupList?: string[]) => {
  if(!groupList)
    groupList = parseUsergroup();

  return groupList?.find(x => x == "administrators" || x == groupToCheck);
}

export const checkPerm = (userMenuPerm: number, method: PermMethod) => {
  return addPerm(userMenuPerm, method) === userMenuPerm;
};

export const addPerm = (perm: number, method: PermMethod) => {
  return perm | (1 << method);
};

export const removePerm = (perm: number, method: PermMethod) => {
  return perm & ~(1 << method);
};