import sellerApi from '../../api/sellerdashboardapi'
import router from '../../router'
import Toast from '../../views/Toast';
//import axios from 'axios'

const state = {
  users: [
    { id: 1, username: 'lavanya@gmail.com', password: 'lavu@123', role: 'Lavanya' },
    { id: 2, username: 'jyoti@gmail.com', password: 'jyoti@12', role: 'Jyoti' },
    { id: 3, username: 'snehil@gmail.com', password: 'snehil@1', role: 'Snehil' },
  ],
  // token:true,
  userDetails: {},
  isLoggedIn: false,
};

const getters = {
  getLoginStatus: function (state) {
    if (state.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  },

  getUserDetails: function (state) {
    return state.userDetails;
  },

  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
};

const mutations = {
  setLoggedUser: function(state, user){
    state.isLoggedIn = true;
      state.userDetails =user;
  },

  setLogout(state, val) {
    state.isLoggedIn = val;
    if (!(router.history.current.path === '/')) {
      router.push('/').catch(() => { });
    }
  },

};

const actions = {
  async login({ commit,/*  dispatch */ }, req) {
    await sellerApi.login(req).then(response => {
      if ((response.status === 201 || response.status === 200) && response.data) {
        if(response.data.sellerId > 0){
        commit("setLoggedUser", response.data);
        router.push('/default');
        }else{
          Toast.showToast("Seller Not Found", "E");
        }
      }
    }).catch(err => {
      if (err.response && err.response.status === 401) {
        Toast.showToast("Username or password is wrong", "E");
       }
     // dispatch("handleException", err.response, { root: true });

    });
  }


};



export default {
  state,
  getters,
  mutations,
  actions
};