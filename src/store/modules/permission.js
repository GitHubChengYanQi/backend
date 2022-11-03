import { dealPermissionData } from '@/router/router.config'
import { errorPage } from '@/router/base/error'
import { permissionByUser } from '@/api/login'

const permission = {
  state: {
    addRouters: [],
    sideMenus: [],
    topMenuKey: '',
    breadcrumb: [],
    permissionList: [],
    defaultRoutePath: '',
    returnPath: '',
    isBreadcrumb: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers.concat(errorPage)
    },
    CLEAR_ROUTERS: (state) => {
      state.addRouters = []
    },
    SET_SIDE_MENUS: (state, sideMenus) => {
      state.sideMenus = sideMenus
    },
    SET_TOP_MENU_KEY: (state, topMenuKey) => {
      state.topMenuKey = topMenuKey
    },
    SET_BREADCRUMB: (state, breadcrumb) => {
      state.breadcrumb = breadcrumb
    },
    SET_PERMISSION_LIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_DEFAULT_ROUTER_PATH: (state, defaultRoutePath) => {
      state.defaultRoutePath = defaultRoutePath
    },
    SER_RETURN_PATH: (state, returnPath) => {
      state.returnPath = returnPath
    },
    SET_ISBREADCRUMB: (state, isBreadcrumb) => {
      state.isBreadcrumb = isBreadcrumb
    }
  },
  actions: {
    async getPermissionList ({ commit }) {
      try {
        const { data } = await permissionByUser()
        if (data.length > 0) {
          const { topMenus, secondMenus, path } = dealPermissionData(data)
          // console.log(topMenus, secondMenus, path)
          commit('SET_PERMISSION_LIST', topMenus)
          commit('SET_ROUTERS', secondMenus)
          commit('SET_DEFAULT_ROUTER_PATH', path)
          return secondMenus
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export default permission
