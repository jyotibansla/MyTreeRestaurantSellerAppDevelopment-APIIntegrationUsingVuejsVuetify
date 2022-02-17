<template>
  <v-app>

    <Login v-if="!this.$store.state.Login.isLoggedIn"></Login>
    <SideNav v-if="this.$store.state.Login.isLoggedIn"></SideNav>
    <!-- <SideNav ></SideNav> -->

  </v-app>
</template>

<script>
import SideNav from './components/SideNav.vue'
import Login from './components/Login.vue'
import { /* mapActions, */ mapGetters } from 'vuex'
export default {
  name: 'App',
  components:{
    Login,
     SideNav
  },
  data() {
   return{
     
   }
  },
  computed: {
    ...mapGetters(["getLoginStatus" ]),
  },
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th{
white-space: normal;
}
</style>
