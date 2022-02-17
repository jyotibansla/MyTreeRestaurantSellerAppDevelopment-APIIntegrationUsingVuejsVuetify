<template>
  <div class="dashboard pa-4 mt-1">
    <div class="text-h6">My Defaults</div>
    <v-card class="pa-4 mt-4">
      <v-card-title> MyTree Commission: {{defaultCommission}}%</v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle class="black--text text-h6">
       Selected Cities</v-card-subtitle>
      <v-divider></v-divider>
      <v-data-table :headers="headers" :items="itemsSlNum" class="mt-2" hide-default-footer>
       <template v-slot:[`item.deliveryPeriod`]="{ item }">
         {{item.deliveryPeriod}}&nbsp;&nbsp;{{item.deliveryChronograph}}
       </template>
      </v-data-table>
    </v-card>
  </div>
</template>


<script>
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      items: [],
      defaultCommission:0,
      unsubscribe:""
    };
  },
  computed: {
    itemsSlNum(){
       return this.items.map((d, index) => ({ ...d, snum: index + 1 }))
    },

    headers() {
      let headers = [
        { text: 'Sl. No.', value: 'snum' },
        { text: 'City', value: 'cityName' },
        { text: 'Delivery Charge', value: 'deliveryCharge' },
        { text: 'Delivery Time', value: 'deliveryPeriod' },
      ];
      return headers;
    },
  },

  beforeDestroy(){
    this.unsubscribe();
  },

  created(){
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === "setMyDefault" && mutation.payload) {
        this.items = JSON.parse(mutation.payload);
        this.defaultCommission = this.items[0].commission;
      }
    });
    let param = {
      sellerId: 1
    };
    this.getMydefault(param);
  },

  methods: {
    ...mapActions(['getMydefault']),
  },
};
</script>

<style scoped>
</style>

