import user from "@/api/modules/user"

const state = {
  userInfo: { user: {} }
}

const getters = {

}

const mutations = {
  setUserInfo(state, payload) {
    state.userInfo = payload
  }
}

const actions = {
  getUserInfo({ commit }) {
    user.getInfo().then((res) => {
      commit('setUserInfo', res.data)
    });
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
