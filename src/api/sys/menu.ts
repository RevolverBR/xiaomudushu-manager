import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  // GetAllMenu = '/menu'
  GetActiveMenu = '/menu/active',
  CreateMenu = '/menu',
  UpdateMenu = '/menu'
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

// 9-5
// export const getAllMenu = () => {
//   return defHttp.get({url: Api.GetAllMenu})
// }
export const getActiveMenu = () => {
  return defHttp.get({url: Api.GetActiveMenu})
}

// 10-2
export const createMenu = (data) => {
  return defHttp.post({url: Api.CreateMenu, data})
}
// 10-3
export const updateMenu = (data) => {
  return defHttp.put({url: Api.CreateMenu, data})
}