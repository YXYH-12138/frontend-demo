import user from "@/api/modules/user"

const state = {
  headerMenus: [
    { title: "组件", path: "/components" },
    { title: "模板", path: "/template" },
  ],
  routers: [],
  hasAuth: false
}

const getters = {
  // 水资源数据
  wrzRouter(state) {
    return state.routers.filter(item => item.name === 'Wrz')[0]
  },
  // 系统管理
  systemRouter(state) {
    return state.routers.filter(item => item.name === 'System')[0]
  }
}

const mutations = {
  setRouters(state, payload) {
    state.routers = payload
  },
  setAuthState(state, payload) {
    state.hasAuth = payload
  }
}

const actions = {
  getRouters({ commit }) {
    return user.getRouters().then((res) => {
      commit('setRouters', res.data)
      commit('setAuthState', true)
      return res.data
    });
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
