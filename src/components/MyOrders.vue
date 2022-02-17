<template>
  <div class="orders pa-3">
    <div class="text-h6">My Orders</div>
    <v-data-table
      :headers="headers"
      :items="myOrders"
      sort-by="sellerOrderId"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:[`item.orderStatus`]="{ item }">
        <div class="d-flex justify-space-between" no-gutters>
          <v-chip small dark :color="getColor(item.orderStatus)">
            {{ item.orderStatus }}
          </v-chip>
        </div>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-menu bottom right v-if="(item.orderStatus === 'DISPATCHED' || item.orderStatus === 'ACTIVE')">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="statusAction(item, 'DELIVERED')"
              v-if="item.orderStatus === 'DISPATCHED'"
            >
              Delivered
            </v-list-item>
            <v-list-item
              @click="statusAction(item, 'DISPATCHED')"
              v-if="item.orderStatus == 'ACTIVE'"
            >
              Dispatched
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:[`item.productImages`]="{ item }">
        <v-img :src="item.productImages[0].toString()" height="50px" width="50px"></v-img>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-col cols="12" md="3" lg="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              hide-details
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="20%" persistent>
            <v-card>
              <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-btn icon light @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <div class="d-flex justify-center">
                <v-img
                  src="../assets/img/myTree.png"
                  max-height="50"
                  max-width="50">
                </v-img>
              </div>
              <v-card-title
                class="d-flex justify-center red--text font-weight-bolder"
                >Confirm {{ status }} ?</v-card-title>
              <v-card-actions class="d-flex justify-center">
                <v-btn dark class="mb-2" color="grey" @click="close">
                  No
                </v-btn>
                <v-btn dark class="mb-2" color="pink" @click="updateStatus">
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

       </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: "",
    status: "",
    item:{},
    myOrders: [],
    unsubscribe:""
  }),

  computed: {
    headers() {
      let headers = [
        { text: "", value: "action", width: "20px", sortable: false, align:'start' },
        { text: "Order Id",value: "sellerOrderId",width: "150px"},
        { text: "Product Thumbnail",value: "productImages",width: "180px"},
        { text: "Product Name", value: "productName", width: "200px" },
        { text: "Order Status", value: "orderStatus", width: "150px" },
        { text: "Customer's Name", value: "customerName", width: "150px" },
        { text: " Order Qty", value: "quantity", width: "150px" },
        { text: "Total Amount", value: "total", width: "150px" },
        { text: "Ordered On", value: "orderedOn", width: "200px" },
        { text: "Reported On", value: "reportedOn", width: "200px" },
        { text: "Dispatched On", value: "dispatchedOn", width: "200px" },
        { text: "Delievered On", value: "deliveredOn", width: "200px" },
      ];
      return headers;
    },
  },

  beforeDestroy(){
    this.unsubscribe();
  },

  created() {
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === "setMyOrders" && mutation.payload) {
        this.myOrders = JSON.parse(mutation.payload);  
      }
    });
    // let param ={
    //   sellerId :1
    // };
    this.getMyOrders();
  },
  methods: {
    ...mapActions(['getMyOrders','orderDispatch','orderDeliver']),

    getColor(val) {
      if (val === "ACTIVE") return "warning";
      else if (val === "DELIVERED") return "success";
      else if (val === "DISPATCHED") return "green lighten-2";
      else if (val === "REPORTED") return "deep-orange lighten-3";
      else return "red";
    },

    close(){
      this.item = {};
      this.status = "";
      this.dialog = false;
    },

    
    statusAction(item, val) {
      this.item = item;
      this.status = val;
      this.dialog = true;
    },

    updateStatus() {
      let param ={
        sellerOrderId: this.item.sellerOrderId
      }
      if(this.status === 'DELIVERED'){
        this.orderDeliver(param);
      }else if(this.status === 'DISPATCHED'){
        this.orderDispatch(param);
      }
      this.close();
    },
    
  },
};
</script>

<style scoped>
</style>