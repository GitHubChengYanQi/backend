const wxCustomer = {
  state: {
    prizeLevel: {}
  },

  mutations: {
    SET_LEVEL_DATA: (state, data) => {
      state.prizeLevel = data
    }
  },

  actions: {
    // 设置奖品相关数据
    setPrizeData ({ commit }, data) {
      commit('SET_LEVEL_DATA', data)
    }
  }
}

export default wxCustomer
