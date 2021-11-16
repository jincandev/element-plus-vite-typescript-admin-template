const state = () => ({
  collapse: false
});

const getters = {
  collapse(state: any) {
    return state.collapse;
  },
};

const mutations = {
  SWITCH_COLLAPSE(state: any, collapse: boolean | undefined) {
    state.collapse = collapse ?? !state.collapse;
  },
  SET_MENUS(state: any, menus: any[]) {},
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
