import sellerApi from '../../api/sellerdashboardapi'
import Toast from '../../views/Toast';

const state ={
    myOrders:null
};

const getter = {

};

const mutations = {
    setMyOrders: function(state, val){
        state.myOrders = val;
    }
};

const actions = {
   async getMyOrders({commit, dispatch,rootState}){
    let sid = {sellerId:rootState.Login.userDetails.sellerId}
    await sellerApi.getMyOrders(sid).then(response => {
        if ((response.status === 201 || response.status === 200) && response.data) {
          commit("setMyOrders", JSON.stringify(response.data));
        }
      }).catch(err => {
        dispatch("handleException", err.response, { root: true });
      });
   },

   async orderDeliver({/* commit,  */dispatch,rootState},req){
    await sellerApi.orderDeliver(req).then(response => {
        if ((response.status === 201 || response.status === 200) && response.data) {
         if(response.data.status === true){
           let sid = {sellerId:rootState.Login.userDetails.sellerId}
           dispatch("getMyOrders",sid);
           Toast.showToast(response.data.message,"S");
         }else{
          Toast.showToast(response.data.message,"E")
         }
        }
      }).catch(err => {
        dispatch("handleException", err.response, { root: true });
      });
   },

   async orderDispatch({/* commit,  */dispatch,rootState},req){
    await sellerApi.orderDispatch(req).then(response => {
        if ((response.status === 201 || response.status === 200) && response.data) {
         if(response.data.status === true){
          let sid = {sellerId:rootState.Login.userDetails.sellerId}
           dispatch("getMyOrders",sid)
           Toast.showToast(response.data.message,"S");
         }else{
          Toast.showToast(response.data.message,"E")
         }
        }
      }).catch(err => {
        dispatch("handleException", err.response, { root: true });
      });
   }

};

export default {
    state,
    getter,
    mutations,
    actions
}