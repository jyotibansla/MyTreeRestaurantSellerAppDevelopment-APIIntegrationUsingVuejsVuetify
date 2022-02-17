import sellerApi from '../../api/sellerdashboardapi'
import Toast from '../../views/Toast'

const state = {
    myProducts: null,
    productTags: null,
    media:null,
    tasteMeters:null,
    uploadProdMsg:null
}

const getters = {
    getProducts: function (state) {
        return state.myProducts;
    },

    getMedia: function (state) {
        return state.media;
    },

    getUploadProdMsg: function (state) {
        return state.uploadProdMsg;
    }
}

const mutations = {
    setMyProducts: function (state, products) {
        state.myProducts = products;
    },

    setProductTags: function (state, tags) {
        state.productTags = tags;
    },

    setTasteMeters: function (state, val){
        state.tasteMeters = val;
    },

    setMedia: function (state, media){
        state.media = media;
    },

    setUploadMessage: function (state, val) {
        state.uploadProdMsg = val;
    }
}

const actions = {
    async getMyproducts({ commit, dispatch, rootState }) {
        let sid = {sellerId:rootState.Login.userDetails.sellerId}
        await sellerApi.getMyproducts(sid).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                commit("setMyProducts", JSON.stringify(response.data));
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });

    },


    async editProducts({ dispatch, rootState }, req) {
        await sellerApi.editMyProduct(req).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                if(response.data.success ===true){
                let sid = {sellerId:rootState.Login.userDetails.sellerId}
                dispatch('getMyproducts',sid);
                Toast.showToast(response.data.message, "S");
            }else{
                Toast.showToast(response.data.message, "E");
            }
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });
    },

    async getProductTags({commit, dispatch }) {
        await sellerApi.getProductTags().then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                commit('setProductTags', JSON.stringify(response.data));
            }
        }).catch(err => {
            console.log("tags error");
            dispatch("handleException", err.response, { root: true });
        });
    },

    async addMedia({commit, dispatch }, req) {
        await sellerApi.addMedia(req).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                commit("setMedia", JSON.stringify(response.data));
                Toast.showToast("Image Uploaded Successfully", "S");
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });
    },

    async getTasteMeters({ commit, dispatch }, req) {
        await sellerApi.getTasteMeters(req).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                commit("setTasteMeters", JSON.stringify(response.data));
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });

    },

    async uploadProducts({commit, dispatch, rootState }, req) {
        let sid = {sellerId:rootState.Login.userDetails.sellerId};
        await sellerApi.uploadProducts(req,sid).then(response => {
            if ((response.status === 201 || response.status === 200) && response.data) {
                if(response.data.success === true){
                    commit('setUploadMessage', JSON.stringify(response.data));
                Toast.showToast(response.data.message, "S");
            }else{
                Toast.showToast(response.data.message, "E");
            }
            }
        }).catch(err => {
            dispatch("handleException", err.response, { root: true });
        });
    },

};



export default {
    state,
    getters,
    mutations,
    actions
}