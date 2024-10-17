import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
// import { func } from 'vue-types';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  // 改成真实接口
  GetUserInfo = '/user/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  // 16-4 获取用户列表
  User = '/user',
  // 17-6
  Role = '/role',
  RoleMenu = '/role/role_menu',
  RoleAuth = '/role/role_auth',
  Auth = '/role/auth',
  RoleAuthByName = '/role/role_auth_by_name'
}

// 16-4 获取用户列表
export function getUserList(params): Promise<any> {
  // console.log(params)
  return defHttp.get<GetUserInfoModel>({ url: Api.User, params });
}

// 新增用户
export function addUser(data): Promise<any> {
  // console.log(data);
  return defHttp.post<GetUserInfoModel>({ url: Api.User, data });
}

// 更新用户
export function editUser(data): Promise<any> {
  return defHttp.put<GetUserInfoModel>({ url: Api.User, data });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

// role
export function addRole(params) {
  return defHttp.post({ url: Api.Role, params });
}

export function updateRole(params) {
  return defHttp.put({ url: Api.Role, params });
}

// role_menu
export function addRoleMenu(data) {
  return defHttp.post({ url: Api.RoleMenu, data });
}

export function getRoleMenu(params) {
  return defHttp.get({ url: Api.RoleMenu, params });
}

export function deletRoleMenuById(roleId) {
  return defHttp.delete({ url: Api.RoleMenu, data: {roleId} });
}

// auth
export function getAuthList(params) {
  return defHttp.get({ url: Api.Auth, params });
}

export function addAuth(data) {
  return defHttp.post({ url: Api.Auth, data });
}

export function editAuth(data) {
  return defHttp.put({ url: Api.Auth, data });
}

export function deleteAuth(data) {
  return defHttp.delete({ url: Api.Auth, data });
}

// role_auth
export function addRoleAuth(params) {
  return defHttp.post({ url: Api.RoleAuth, params });
}

export function deleteRoleAuthById(data) {
  return defHttp.delete({ url: Api.RoleAuth, data });
}

export function getRoleAuth(params) {
  return defHttp.get({ url: Api.RoleAuth, params });
}

export function getRoleAuthByName(params): Promise<any> {
  return defHttp.get({ url: Api.RoleAuthByName, params });
}
