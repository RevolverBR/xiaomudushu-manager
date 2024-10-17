import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { message } from 'ant-design-vue';
import { useUserStore } from '/@/store/modules/user';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

// 判断权限方法
export function hasAuth(keyMsg, authmsg) {
  if (!authmsg) authmsg = ''
  const userStore = useUserStore()
  const { userInfo } = userStore
  const { auth = [] } = userInfo
  // 有为true，无为false
  const authValue = auth.find(item => item.key === keyMsg)
  if (!authValue) {
    message.error(`没有${authmsg}权限，请联系管理员`)
    return false
  }
  return true
}
