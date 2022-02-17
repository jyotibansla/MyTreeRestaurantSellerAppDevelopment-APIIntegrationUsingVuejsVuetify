import Toast from "../../views/Toast";

const state = {
  error:''
}
const mutations = {
  setError: function (state, val){
    state.error = val;
  }
}
const actions = {
   // Vuex Action to handle exception
   handleException({ commit }, err) {
    commit('setError','');
    if (err.data.status === 401) {
      Toast.showToast(err.data.error, "E");
    } else if (err.data.status === 403) {
        Toast.showToast(err.data.error, "E");
    } else if (err.data.status === 400) {
        Toast.showToast(err.data.error, "E");
    } else if (err.data.status === 404) {
        Toast.showToast(err.data.error, "E");
    } else if (err.data.status === 500) {
      Toast.showToast(err.data.error, "E");
    }else {
      Toast.showToast("Unknown Error Occured.", "E");
    }
  }
};

export default {
  state,
  mutations,
  actions
};