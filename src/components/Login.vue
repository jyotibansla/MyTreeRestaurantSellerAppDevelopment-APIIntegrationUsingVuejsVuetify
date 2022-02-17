<template>
  <v-container fluid fill-height>
    <div class="background">
      <v-img
        src="../assets/img/bg-img1.png"
        class="rounded-bl-md rounded-r-lg"
        width="90%"
        height="100%"
      ></v-img>
    </div>
    <div class="background1">
      <v-img
        src="../assets/img/bg-img.png"
        class="rounded-bl-md rounded-r-lg"
        width="90%"
        height="100%"
      ></v-img>
    </div>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="pa-8 rounded-lg">
          <div class="d-flex justify-center align-center">
            <v-img
              max-height="80"
              max-width="80"
              src="../assets/img/myTree.png"
            ></v-img>
          </div>
          <h2 class="pink--text d-flex justify-center align-center">
            MyTree Seller Admin Login
          </h2>
          <v-form @submit.prevent="validate" ref="form">
            <v-card-text>
              <v-text-field
                v-model="email"
                type="email"
                label="UserName/Email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
              />
              <!-- :rules="emailRules" -->
              <v-text-field
                v-model="password"
                :rules="pwdRules"
                :type="passwordShow ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-key"
                placeholder="Password"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
              />
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn type="submit" color="pink">
                <span class="white--text px-8">Login</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar
      :timeout="timeout"
      :value="true"
      color="red"
      absolute
      right
      rounded="pill"
      top
      v-if="show"
    >
      Invalid Credentials please check it!!!
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      passwordShow: false,
      show: false,
      timeout: 2000,
      valid: true,
      password: "",
      pwdRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 7) || "Password should be min 7 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    ...mapActions(["login"]),
    validate() {
      this.$refs.form.validate();
      /*  if(this.email==='lavanya@prakat.in' && this.password==='12345678'){
         this.login(false);
        }
        else{
          this.show = true;
        } */
      this.submit();
    },
    submit() {
      var form = {
        userName: this.email,
        password: this.password,
      };

      this.login(form);
    },
    forgetPassword() {
      console.log("thisf", this.email);
    },
  },
};
</script>
<style scoped>
.background {
  position: absolute;
  display: block;
  width: 50%;
  height: 50%;
  top: 0;
  border-bottom-right-radius: 20px;
  background-size: cover;
}
.background1 {
  background-image: url("../assets/img/bg-img.png") !important;
  position: absolute;
  display: block;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  bottom: 0;
  right: 0;
  background-size: cover;
}
</style>
