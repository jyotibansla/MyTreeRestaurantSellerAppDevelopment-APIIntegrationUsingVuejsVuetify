import axios from 'axios';

const ROOT_URL_USER = "http://15.206.66.52:9090/v1/users";

export default {
    login: function (req){
        return axios.post(`${ROOT_URL_USER}/dashboard/auth/login`,null , {params:req});
    },

    getMyDefault: function (req) {
        return axios.get(`${ROOT_URL_USER}/seller/defaults/get`,{params:req});
    },

    getTasteMeters: function () {
        return axios.get(`${ROOT_URL_USER}/items/taste/get-all`)
    },

    getMyOrders: function (req) {
        return axios.get(`${ROOT_URL_USER}/dashboard/seller/orders/get-all`, {params: req})
    },

    getMyproducts: function (req) {
        return axios.get(`${ROOT_URL_USER}/dashboard/seller/products/get-all`, {params:req})
    },

    editMyProduct: function(req) {
        return axios.post(`${ROOT_URL_USER}/dashboard/seller/product/edit`, req, {
            headers:{
                "Content-Type": "application/json"
            }
        })        
    },

    uploadProducts: function (req,sid) {
        return axios.post(`${ROOT_URL_USER}/dashboard/seller/upload/products`, req, {params:sid},{
            headers:{
                "Content-Type": "application/json"
            }
        })
    },

    getProductTags: function(){
        return axios.get(`${ROOT_URL_USER}/product/tags`);
    },

    addMedia: function(req) {
        return axios.post(`${ROOT_URL_USER}/media/add`, req, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    },
    
    orderDeliver: function (req) {
        return axios.post(`${ROOT_URL_USER}/order/seller/notify/delivered`, null, {params:req})
    },

    orderDispatch: function (req) {
        return axios.post(`${ROOT_URL_USER}/order/seller/notify/dispatched`, null, {params:req})
    }

    
}