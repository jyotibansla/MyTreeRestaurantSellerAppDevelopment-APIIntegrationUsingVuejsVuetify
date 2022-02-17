<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-avatar tile>
          <v-img
            max-height="50"
            max-width="50"
            src="../assets/img/myTree.png"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> MyTree Admin </v-list-item-title>
          <v-list-item-subtitle> Kaho Khilao Kamao! </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          @click="item.action && item.action()"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
     
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="pink" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!--  <v-toolbar-title>Dashboard</v-toolbar-title> -->
      <v-spacer></v-spacer>
     <!--  <v-badge color="green" :content="content" class="mr-4">
          <v-icon>mdi-bell</v-icon>
      </v-badge> -->

      <!--       <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->

      <span>
        <v-avatar>
          <!-- <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" /> -->
          <v-icon size="40">mdi-account-circle</v-icon>
        </v-avatar>
        <span v-text="this.$store.state.Login.userDetails.userName" class="ml-2"></span>
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="goTo">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item>
              <v-list-item-title>Profile Setting</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-menu>
      </span>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      content: 232,
      items: [
        { title: "My Defaults", icon: "mdi-view-dashboard", to: "/default" },
        { title: "My Orders", icon: "mdi-cart", to: "/myOrders" },
        { title: "My Products", icon: "mdi-basket", to: "/myProducts" },
        { title: "Upload Products", icon: "mdi-basket-plus", to: "/upload-products" },
      ],
    };
  },
  methods: {
    goTo() {
      console.log("logoutt");
      // if (val === "/login") {
      this.$store.commit("setLogout", false);
      // } else {
      //   this.$router.push(val);
      // }
    },
  },
};
</script>