// 让compent与route形成映射关系
import { asyncRoutes } from '@/router/routes';

const newRoutes = {}

function generateRouteMap(routes) {
  return routes.map((item) => {
    if (item.children && item.children.length > 0) {
      generateRouteMap(item.children)
    }
    newRoutes[item.name] = item.component
  })
}
generateRouteMap(asyncRoutes)
// console.log(newRoutes)
export const ROUTE_MAP = newRoutes