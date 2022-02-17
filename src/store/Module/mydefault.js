import dashboardApi from '../../api/sellerdashboardapi'

const state = {
    mydefault:null
};

const getters = {

};

const mutations = {
    setMyDefault : function (state, data){
        state.mydefault = data;
    }
};

const actions = {
  async  getMydefault({commit,dispatch, rootState}){
    let sid = {sellerId:rootState.Login.userDetails.sellerId}
        await dashboardApi.getMyDefault(sid).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                commit("setMyDefault", JSON.stringify(response.data));
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });
    }
};


export default {
    state,
    getters,
    mutations,
    actions
}