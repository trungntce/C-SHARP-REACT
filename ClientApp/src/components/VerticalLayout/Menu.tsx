import api from "../../common/api";
import { Dictionary } from "../../common/types";



export interface MenuItemsProps {
  id: number;
  novidade?: any;
  label: string;
  icon?: string;
  link?: string;
  badge?: string;
  badgecolor?: string;
  subItems?: any;
  isHeader?: boolean;
  className?: string;
  menuId?: string;
  menuType?: string;
  parentId?: string;
  childid: number;
  target?: string;
}

const result = await api<Dictionary[]>("get", "menu", { filterByAuth: true });
const list = result.data;
const menuItemsDb: Array<MenuItemsProps> = list.filter((x : any) => x.depth <= 1).map((x : any, index : any) => {
  return {
    id: index,
    novidade: x.childCount <= 0,
    label: x.menuName,
    icon: x.icon,
    link: x.menuBody,
      menuId: x.menuId,  
      menuType: x.menuType,
      parentId: x.parentId,
      childid: index,
    target: x.menuType == 'P' ? '_blank' : '_self',
    subItems: x.depth <= 0 || x.childCount <= 0 ? undefined : list.filter((y : any) => y.parentId == x.menuId).map((z : any, index2 : any) => {
      return {
          id: index2 + 1000000,
          childid: index2,
        label: z.menuName,
        link: z.menuBody,
        parentId: z.parentId,
        menuId: z.menuId,
        target: z.menuType == 'P' ? '_blank' : '_self',
      }
    }),
    isHeader: x.depth <= 0
  }
});

export const getFavorite = async () => {
  const result = await api<Dictionary[]>("get", "favorite", {});
  return result.data;
}

export const favoriteListToMenuItemList = (favoriteList: Dictionary[]) => {
  const rtn: Array<MenuItemsProps> = [
    {
      id: 9999999,
      label: "Favorite",
          isHeader: true,
          childid: 9999999
    },
    ...favoriteList.map((x, index) => favoriteToMenuItem(x, index)),
  ];

  return rtn;
}

export const favoriteToMenuItem = (favorite: Dictionary, index: number) => {
  return {
    id: index + 2000000,
    novidade: true,
    label: favorite.menuName,
    icon: favorite.icon,
    link: favorite.menuBody,
      menuId: favorite.menuId,
      childid: index,
    target: favorite.menuType == 'P' ? '_blank' : '_self',
    className: "menu-favorite",
    classNameLink: "menu-favorite-link",
  }
}

let favoriteList: Dictionary[] = [];
let menuItemsFavorite: MenuItemsProps[] = [];

function ModMenu(obj: MenuItemsProps[]) {
    var menuItemsMainPage = [];

    var results = [...obj];
    for (var i = 0; i < results.length; i++) {
        var item = results[i];
        if (item.isHeader || !item.parentId)
            menuItemsMainPage.push(item);
    }


    for (var i = 0; i < results.length; i++) {
        var item = results[i];

        menuItemsMainPage.forEach((i1, k1) => {
            if (i1.menuId == item.parentId) {

                if (!i1.subItems)
                    i1.subItems = [];

                i1.subItems.push(item);
            }
        })
    }

    return menuItemsMainPage;
}
export const refreshFavorite = async () => {
  favoriteList = await getFavorite();
  menuItemsFavorite = favoriteListToMenuItemList(favoriteList);

    menuItemsAll = [...menuItemsDb];
    menuItemsMainPage = ModMenu(menuItemsDb);
}

let menuItemsAll: MenuItemsProps[] = [];
let menuItemsMainPage: MenuItemsProps[] = [];
await refreshFavorite();

const globalContext: Dictionary = {};

export { favoriteList, menuItemsFavorite, menuItemsDb, menuItemsAll, menuItemsMainPage, list as menuList, globalContext };
